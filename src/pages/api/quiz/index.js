import { getSession } from 'next-auth/react';
import db from '/lib/mongodb';

export default async function getUserInfo(req, res) {
	const session = await getSession({ req });
	if (!session) {
		return res.status(200).send({ quizzes: 'none', totalPages: 0, search: '' });
	}
	try {
		let search = req.query.search;
		let query = {};

		const limit = req.query.limit;
		const quizzesPerPage = 6;

		if (search != undefined) {
			query = {
				$or: [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }],
			};
		}

		const totalquizzes = await db.collection('quizzes').countDocuments(query);

		if (totalquizzes == 0) {
			return res.status(200).send({ quizzes: 'none', totalPages: 0, search: search });
		}

		const quizzes = await db
			.collection('quizzes')
			.aggregate([
				{ $match: query },
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
						slug: 1,
						title: 1,
						description: 1,
						image: 1,
						info: 1,
						type: 1,
						'user.username': 1,
						'user.image': 1,
					},
				},
			])
			.limit(parseInt(limit * quizzesPerPage))
			.toArray();

		return res.status(200).send({ quizzes: quizzes, search: search, limit: limit });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
