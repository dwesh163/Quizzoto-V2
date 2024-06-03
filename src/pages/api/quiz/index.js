import { getSession } from 'next-auth/react';
import db from '/lib/mongodb';

export default async function getUserInfo(req, res) {
	try {
		const session = await getSession({ req });

		let search = req.query.search;
		let query = {};
		let selectedQuizzes = [{ visibility: 'public' }, { creator: session && session.user && session.user.id }];

		const limit = req.query.limit;
		const roomId = req.query.roomId;
		const order = req.query.order ? req.query.order : 'rating';
		const quizzesPerPage = 6;

		if (roomId) {
			const room = await db.collection('rooms').findOne({ id: roomId });
			if (room.share.authorized.includes(session.user.id) || room.creator == session.user.id) {
				for (let i = 0; i < room.quizzes.length; i++) {
					selectedQuizzes.push({ id: room.quizzes[i] });
				}
			}
		}

		if (search !== undefined) {
			query = {
				$and: [
					{
						$or: selectedQuizzes,
					},
					{
						$or: [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }],
					},
				],
			};
		}

		const totalquizzes = await db.collection('quizzes').countDocuments(query);

		if (totalquizzes == 0 || limit == undefined) {
			return res.status(200).send({ quizzes: 'none', search: search });
		}

		let sortOptions = {};
		if (order === 'desc') {
			sortOptions = { title: -1 };
		} else if (order === 'asc') {
			sortOptions = { title: 1 };
		} else if (order === 'date') {
			sortOptions = { date: -1 };
		} else if (order === 'rating') {
			sortOptions = { rating: -1, title: 1 };
		} else {
			sortOptions = { _id: -1 };
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
						id: 1,
						slug: 1,
						title: 1,
						description: 1,
						image: 1,
						info: 1,
						type: 1,
						'user.username': 1,
						'user.image': 1,
						tags: 1,
						rating: 1,
						date: 1,
					},
				},
				{ $sort: sortOptions },
			])
			.limit(parseInt(limit * quizzesPerPage))
			.toArray();

		return res.status(200).send({ quizzes: quizzes, search: search, limit: limit });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
