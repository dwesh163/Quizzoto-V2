import { getServerSession } from 'next-auth';
import db from '/lib/mongodb';
import { authOptions } from '../auth/[...nextauth]';

export default async function getResults(req, res) {
	const session = await getServerSession(req, res, authOptions);
	try {
		console.log(req.query.resultId);
		const [result] = await db
			.collection('results')
			.aggregate([
				{
					$match: {
						id: req.query.resultId,
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'player',
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
					$lookup: {
						from: 'quizzes',
						localField: 'quiz',
						foreignField: 'id',
						as: 'quiz',
					},
				},
				{
					$unwind: {
						path: '$quiz',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						_id: 0,
						points: 1,
						results: 1,
						roomId: 1,
						visibility: 1,
						'user.name': 1,
						'user.username': 1,
						'user.image': 1,
						'user.email': 1,
						'quiz.title': 1,
						'quiz.description': 1,
					},
				},
			])
			.toArray();

		if (result.visibility == 'private' && session?.user?.email != result?.user?.email) {
			return res.status(404).send('Not Found');
		}

		if (!result) {
			return res.status(404).send('Not Found');
		}

		if (result.visibility != 'private') {
			delete result.user.email;
			delete result.roomId;
		}

		return res.status(200).send(result);
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
