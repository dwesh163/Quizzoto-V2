import db from '/lib/mongodb';

export default async function getQuizInfo(req, res) {
	try {
		const [quiz] = await db
			.collection('quizzes')
			.aggregate([
				{
					$match: {
						slug: req.query.slug,
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
						'user.name': 1,
						'user.username': 1,
						'user.image': 1,
					},
				},
			])
			.toArray();

		if (quiz == null) {
			return res.status(200).send('404');
		}

		const results = await db
			.collection('results')
			.aggregate([
				{
					$match: {
						quiz: quiz.id,
						creator: { $ne: 'anaonymous' },
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
					$project: {
						_id: 0,
						points: 1,
						visibility: 1,
						'user.username': 1,
						'user.image': 1,
					},
				},
				{ $sort: { points: -1 } },
			])
			.limit(5)
			.toArray();

		delete quiz.id;

		return res.status(200).send({ quiz, results });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
