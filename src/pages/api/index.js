import db from '/lib/mongodb';

export default async function getQuizzes(req, res) {
	try {
		const quizzes = await db
			.collection('quizzes')
			.find(
				{},
				{
					projection: {
						_id: 0,
						slug: 1,
						title: 1,
						image: 1,
						rating: 1,
						date: 1,
					},
				},
				{ $sort: { rating: -1, title: 1 } }
			)
			.limit(3)
			.toArray();

		res.status(200).send({ quizzes: quizzes });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
