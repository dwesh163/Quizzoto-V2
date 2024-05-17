import db from '/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

async function fetchQuiz(quizId) {
	return await db
		.collection('quizzes')
		.aggregate([
			{
				$match: {
					id: quizId,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'creator',
					foreignField: 'id',
					as: 'user',
				},
			},
			{
				$unwind: {
					path: '$user',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 0,
					id: 1,
					slug: 1,
					title: 1,
					description: 1,
					image: 1,
					info: 1,
					type: 1,
					rating: 1,
					date: 1,
					update: 1,
					questions: 1,
					'user.name': 1,
					'user.username': 1,
					'user.image': 1,
					'user.email': 1,
				},
			},
		])
		.toArray();
}

export default async function getQuizInfo(req, res) {
	const session = await getServerSession(req, res, authOptions);

	try {
		if (!session) {
			return res.status(401).send('404');
		}

		if (req.method === 'GET') {
			const [quiz] = await fetchQuiz(req.query.quizId);

			if (!quiz || quiz.user.email !== session.user.email) {
				return res.status(404).send('404');
			}

			return res.status(200).json(quiz);
		} else if (req.method === 'POST') {
			const [quiz] = await fetchQuiz(req.query.quizId);

			if (!quiz || quiz.user.email !== session.user.email) {
				return res.status(404).send('404');
			}

			const data = JSON.parse(req.body);

			const newQuiz = {
				title: data.title,
				description: data.description,
				image: data.image,
				questions: data.questions,
				update: new Date(),
			};

			console.log(newQuiz);

			await db.collection('quizzes').updateOne({ id: req.query.quizId }, { $set: newQuiz });

			return res.status(200).send({ message: 'Ok', slug: quiz.slug });
		} else {
			return res.status(405).send('Method not allowed');
		}
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
