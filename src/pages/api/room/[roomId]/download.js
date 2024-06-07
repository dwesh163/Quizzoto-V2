import { getServerSession } from 'next-auth';
import db from '/lib/mongodb';
import { authOptions } from '../../auth/[...nextauth]';

const json2csv = require('json2csv').parse;

export default async function getRoomsInfo(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(200).send({ error: 'Not Found' });
	}

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

	if (!room) {
		res.status(200).send({ error: 'Not Found' });
	}

	if (!room.share.authorized.includes(session.user.id) && room.creator != session.user.id) {
		res.status(200).send({ error: 'Not Found' });
	}

	if (req.method == 'GET') {
		try {
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

			const fields = ['points', 'user.name', 'user.email', 'quiz.title'];

			const csv = json2csv(results, { fields });

			console.log(room.link.slug);
			res.setHeader('Content-Type', 'text/csv');
			res.setHeader(`Content-Disposition`, `attachment; filename="${room.link.slug}.csv"`);

			return res.status(200).send(csv);
		} catch (error) {
			console.error('Error:', error);
			return res.status(200).send({ error: 'Not Found' });
		}
	} else if (req.method == 'DELETE') {
		if (room.creator != session.user.id) {
			return res.status(400).send({ code: 400, message: 'Bad Request' });
		}
		await db.collection('rooms').deleteOne({ id: room.id });
		await db.collection('results').updateMany({ roomId: room.id }, { $set: { roomId: '' } });

		return res.status(200).send({ code: 201, message: 'ok' });
	} else {
		return res.status(200).send({ error: 'Not Found' });
	}
}
