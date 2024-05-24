import db from '/lib/mongodb';

export default async function getQuestionInfo(req, res) {
	const questionId = req.query.questionId - 1;
	try {
		let quiz = await db.collection('quizzes').findOne(
			{ slug: req.query.slug },
			{
				projection: {
					_id: 0,
					questions: 1,
				},
			}
		);

		if (quiz == null || quiz.questions[questionId] == null) {
			return res.status(200).send('404');
		}

		delete quiz.questions[questionId].correct;
		return res.status(200).send(quiz.questions[questionId]);
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('404');
	}
}
