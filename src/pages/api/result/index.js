import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import db from '/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function Results(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (req.method == 'POST') {
		const { slug, answers, roomId } = JSON.parse(req.body);
		const quiz = await db.collection('quizzes').findOne({ slug: slug });
		const id = uuidv4();

		let points = 0;
		let results = [];

		quiz.questions.map((question, index) => {
			let localPoints = 0;
			if (!answers[index]) {
				return;
			}
			for (const answer of answers[index]) {
				if (question.correct.includes(answer)) {
					localPoints = Math.round(localPoints + parseInt(question.point) / question.correct.length);
				}
			}

			points = points + localPoints;

			return results.push({
				points: localPoints,
				question: question.question,
				answeredCorrectly: localPoints ? true : false,
				userAnswer: answers[index],
				correctAnswer: question.correct,
			});
		});

		let returnObject = {
			quiz: quiz.id,
			id: id,
			points,
			results,
			roomId,
			player: session ? session.user.id : 'Anonymus',
			date: new Date(),
			visibility: session ? 'private' : 'hidden',
		};

		db.collection('results').insertOne(returnObject);

		return res.status(200).json({ succes: true, id: id });
	} else {
		return res.status(405).json({ error: 'Method not allowed' });
	}
}
