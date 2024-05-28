import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import db from '/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function Results(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (req.method == 'POST') {
		const { slug, answers, roomId, starter } = JSON.parse(req.body);
		const quiz = await db.collection('quizzes').findOne({ slug: slug });
		const id = uuidv4();

		console.log(starter);

		let points = 0;
		let results = [];

		quiz.questions.map((question, index) => {
			let localPoints = 0;
			let correct = 0;
			if (!answers[index]) {
				return;
			}
			for (const answer of answers[index]) {
				if (question.correct.includes(answer)) {
					correct++;
				}
			}

			correct = Math.round(correct / question.correct.length);
			localPoints = correct * parseInt(question.point);

			points = points + localPoints;

			return results.push({
				points: localPoints,
				question: question.question,
				answeredCorrectly: localPoints ? true : false,
				userAnswer: answers[index],
				correctAnswer: question.correct,
			});
		});

		const idUser = uuidv4();
		let existingUser = {};

		if (starter?.email && !session) {
			existingUser = await db.collection('users').findOne({ email: starter.email });
			if (!existingUser) {
				const newUser = {
					id: idUser,
					name: starter?.name ? starter.name : null,
					email: starter?.email ? starter.email : null,
					username: starter?.username ? starter.username : null,
					statistics: {
						points: 0,
						quizzes: 0,
						stars: 0,
					},
					verified: false,
				};

				await db.collection('users').insertOne(newUser);
			}
		}

		let returnObject = {
			quiz: quiz.id,
			id: id,
			points,
			results,
			roomId,
			userAgent: req.headers['user-agent'],
			player: session ? session.user.id : starter.email ? (existingUser ? existingUser.id : idUser) : 'Anonymus',
			date: new Date(),
			visibility: session ? 'private' : 'hidden',
		};

		db.collection('results').insertOne(returnObject);

		return res.status(200).json({ succes: true, id: id });
	} else {
		return res.status(405).json({ error: 'Method not allowed' });
	}
}
