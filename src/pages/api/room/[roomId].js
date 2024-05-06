import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import db from '/lib/mongodb';

export default async function getRoomsInfo(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(200).send({ error: 'Not Found' });
	}
	try {
		const [room] = await db
			.collection('rooms')
			.aggregate([
				{ $match: { id: req.query.roomId } },
				{
					$lookup: {
						from: 'users',
						localField: 'creator',
						foreignField: 'id',
						as: 'user',
					},
				},
				{ $unwind: '$user' },
				{
					$project: {
						_id: 0,
						id: 1,
						title: 1,
						comment: 1,
						time: 1,
						quizzes: 1,
						'user.name': 1,
						'user.username': 1,
						'user.image': 1,
						'user.id': 1,
					},
				},
				{ $limit: 1 },
			])
			.toArray();
		const results = await db
			.collection('results')
			.aggregate([
				{
					$match: {
						roomId: req.query.roomId,
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
						roomId: 1,
						id: 1,
						visibility: 1,
						'user.name': 1,
						'user.username': 1,
						'user.image': 1,
						'quiz.title': 1,
						'quiz.id': 1,
						'quiz.description': 1,
					},
				},
			])
			.toArray();

		return res.status(200).send({ results: results });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
