import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import db from '/lib/mongodb';

var parser = require('ua-parser-js');

export default async function getRoomsInfo(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(200).send({ error: 'Not Found' });
	}
	try {
		let quizzes = [];
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
					$lookup: {
						from: 'links',
						localField: 'linkId',
						foreignField: 'linkId',
						as: 'link',
					},
				},
				{ $unwind: '$link' },
				{
					$project: {
						_id: 0,
						id: 1,
						title: 1,
						comment: 1,
						time: 1,
						quizzes: 1,
						'user.name': 1,
						'user.email': 1,
						'user.username': 1,
						'user.image': 1,
						'user.id': 1,
						'link.linkId': 1,
						'link.slug': 1,
					},
				},
				{ $limit: 1 },
			])
			.toArray();

		if (room.user.email != session.user.email) {
			return res.status(200).send({ error: 'Not Found' });
		}

		if (room.quizzes) {
			for (const quizId of room.quizzes) {
				const quiz = await db.collection('quizzes').findOne({ id: quizId }, { projection: { _id: 0, questions: 0 } });
				quizzes.push(quiz);
			}
		}
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
						userAgent: 1,
						date: 1,
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

		let stats = {};

		stats.numbers = [
			{ number: results.length, title: 'People who answered', fluctuate: 10 },
			{ number: 0, title: 'People who clicked', fluctuate: 10 },
			{ number: 0, title: 'People who have just', fluctuate: 10 },
		];
		stats.answersByQuiz = {};
		stats.userAgent = {};
		stats.answersPerHour = {};
		stats.answersPerPoint = {};

		stats.numbers[1].number = await db.collection('links').findOne({ linkId: room.link.linkId }, { projection: { _id: 0, used: 1 } });
		stats.numbers[1].number = stats.numbers[1].number.used;

		results.forEach((result) => {
			const quizId = result.quiz.id;
			stats.answersByQuiz[quizId] = stats.answersByQuiz[quizId] ? stats.answersByQuiz[quizId] + 1 : 1;
		});

		results.forEach((result) => {
			const userAgent = result.userAgent;
			const ua = parser(userAgent);
			stats.userAgent[ua.os.name] = stats.userAgent[ua.os.name] ? stats.userAgent[ua.os.name] + 1 : 1;
		});

		results.forEach((result) => {
			const date = new Date(result.date);
			const hour = date.getHours();
			stats.answersPerHour[hour] = stats.answersPerHour[hour] ? stats.answersPerHour[hour] + 1 : 1;
		});

		results.forEach((result) => {
			const points = result.points;
			const pointRange = Math.floor(points / 100) * 100;
			stats.answersPerPoint[pointRange] = stats.answersPerPoint[pointRange] ? stats.answersPerPoint[pointRange] + 1 : 1;
		});

		results.forEach((result) => {
			const points = result.points;
			const quiz = quizzes.find((quiz) => quiz.id == result.quiz.id);
			if (points == quiz.info.points) {
				stats.numbers[2].number++;
			}
		});

		return res.status(200).send({ results: results, quizzes: quizzes, room: room, stats: stats });
	} catch (error) {
		console.error('Error:', error);
		return res.status(200).send({ error: 'Not Found' });
	}
}
