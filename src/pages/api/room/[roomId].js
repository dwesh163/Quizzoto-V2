import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import db from '/lib/mongodb';

var parser = require('ua-parser-js');

export default async function getRoomsInfo(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(200).send({ error: 'Not Found' });
	}

	const room = await db.collection('rooms').findOne({ id: req.query.roomId });

	if (!room.share.authorized.includes(session.user.id) && room.creator != session.user.id) {
		res.status(200).send({ error: 'Not Found' });
	}

	if (req.method == 'PATCH') {
		const { quizzes } = req.body;
		const { title, comment, slug, instruction, ask, authorized } = req.body;
		if (quizzes) {
			await db.collection('rooms').updateOne({ id: req.query.roomId }, { $set: { quizzes: quizzes } });
			res.status(200).send({ code: 200, message: 'ok' });
		} else if (title && comment && slug && instruction && ask && authorized) {
			await db.collection('rooms').updateOne({ id: req.query.roomId }, { $set: { title, comment, instruction, share: { ask: ask.map((user) => user.id), authorized: authorized.map((user) => user.id) } } });
			res.status(200).send({ code: 200, message: 'ok' });
		} else {
			res.status(200).send({ code: 400, message: 'Bad Request' });
		}
	} else if (req.method == 'GET') {
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
							instruction: 1,
							time: 1,
							quizzes: 1,
							parameters: 1,
							share: 1,
							joinId: 1,
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

			const allQuizzes = await db.collection('quizzes').find({}).toArray();
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
							'user.verified': 1,
							'user.email': 1,
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
				{ number: 0, title: 'People answered correctly', fluctuate: 10 },
			];
			stats.answersByQuiz = {};
			stats.userAgent = { Windows: 0, 'Mac OS': 0, Ubuntu: 0, Android: 0, iOS: 0, Other: 0 };
			stats.answersPerHour = { 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 };
			stats.answersPerPoint = { 0: 0, 50: 0, 100: 0, 150: 0, 200: 0, 250: 0, 300: 0, 350: 0, 400: 0, 450: 0, 500: 0, 550: 0, 600: 0, 650: 0, 700: 0, 750: 0, 800: 0, 850: 0, 900: 0, 950: 0, 1000: 1 };
			stats.answersPerHourPerQuiz = [];
			stats.answersPerPointPerQuiz = [];

			stats.numbers[1].number = await db.collection('links').findOne({ linkId: room.link.linkId }, { projection: { _id: 0, used: 1 } });
			stats.numbers[1].number = stats.numbers[1].number.used;

			results.forEach((result) => {
				const quizId = result.quiz.id;
				stats.answersByQuiz[quizId] = stats.answersByQuiz[quizId] ? stats.answersByQuiz[quizId] + 1 : 1;
			});

			results.forEach((result) => {
				const userAgent = result.userAgent;
				const ua = parser(userAgent);
				if (stats.userAgent[ua.os.name] >= 0) {
					stats.userAgent[ua.os.name] = stats.userAgent[ua.os.name] + 1;
				} else {
					stats.userAgent['Other'] = stats.userAgent['Other'] + 1;
				}
			});

			results.forEach((result) => {
				const date = new Date(result.date);
				const hour = date.getHours() + 2;
				stats.answersPerHour[hour] = stats.answersPerHour[hour] ? stats.answersPerHour[hour] + 1 : 1;
			});

			let color = 0;
			const colors = ['#348888', '#22BABB', '#FA7F08', '#FF5F5D', '#FFB30D'];
			quizzes.forEach((quiz) => {
				let hours = [];

				Object.keys(stats.answersPerHour).forEach((hour) => {
					let numberResult = 0;
					results.forEach((result) => {
						const date = new Date(result.date);
						const options = { timeZone: 'Europe/Paris', hour: '2-digit', hour12: false };
						const resultHour = new Intl.DateTimeFormat('fr-FR', options).format(date);

						if (result.quiz.id != quiz.id) {
							return;
						} else {
							if (parseInt(resultHour) == parseInt(hour)) {
								numberResult++;
							}
						}
					});

					hours.push(numberResult);
				});

				stats.answersPerHourPerQuiz.push({
					name: quiz.title,
					data: hours,
					color: colors[color % 5],
				});

				color++;
			});

			color = 0;
			quizzes.forEach((quiz) => {
				let points = [];

				Object.keys(stats.answersPerPoint).forEach((point) => {
					let numberResult = 0;
					results.forEach((result) => {
						const points = result.points;
						const resultPoint = Math.floor(points / 50) * 100;
						if (result.quiz.id != quiz.id) {
							return;
						} else {
							if (parseInt(resultPoint) == parseInt(point)) {
								numberResult++;
							}
						}
					});

					points.push(numberResult);
				});

				stats.answersPerPointPerQuiz.push({
					name: quiz.title,
					data: points,
					color: colors[color % 5],
				});

				color++;
			});

			results.forEach((result) => {
				const points = result.points;
				const quiz = allQuizzes.find((quiz) => quiz.id == result.quiz.id);
				if (points == quiz.info.points) {
					stats.numbers[2].number++;
				}
			});

			let parameters = {
				parameters: room.parameters,
				share: room.share,
				data: {
					title: room.title,
					comment: room.comment,
					slug: room.link.slug,
					instruction: room.instruction,
					joinId: room.joinId,
				},
			};

			parameters.share = JSON.parse(JSON.stringify(parameters.share));

			parameters.share.ask = await Promise.all(
				Object.keys(parameters.share.ask).map(async (userId) => {
					const user = await db.collection('users').findOne({ id: parameters.share.ask[userId] });
					return user;
				})
			);

			parameters.share.authorized = await Promise.all(
				Object.keys(parameters.share.authorized).map(async (userId) => {
					const user = await db.collection('users').findOne({ id: parameters.share.authorized[userId] });
					return user;
				})
			);

			return res.status(200).send({ results, quizzes, room, stats, parameters });
		} catch (error) {
			console.error('Error:', error);
			return res.status(200).send({ error: 'Not Found' });
		}
	} else {
		return res.status(200).send({ error: 'Not Found' });
	}
}
