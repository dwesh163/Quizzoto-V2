import { getSession } from 'next-auth/react';
import db from '/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function getRoomsInfo(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(200).send({ error: 'unauthorized' });
	}

	try {
		if (req.method == 'GET') {
			const rooms = await db
				.collection('rooms')
				.aggregate([
					{
						$project: { rooms: '$$ROOT', _id: 0 },
					},
					{
						$lookup: {
							localField: 'rooms.creator',
							from: 'users',
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
							comment: '$rooms.comment',
							creator: '$rooms.creator',
							id: '$rooms.id',
							time: '$rooms.time',
							title: '$rooms.title',
							user: {
								image: '$user.image',
								username: '$user.username',
							},
							_id: 0,
						},
					},
				])
				.toArray();

			return res.status(200).send(rooms);
		}
		if (req.method == 'POST') {
			const user = await db.collection('users').findOne({ email: session.user.email });

			const id = uuidv4();

			let room = {
				id: id,
				creator: user.id,
				time: Date.now(),
				title: '',
				comment: '',
			};

			db.collection('rooms').insertOne(room);
			return res.status(200).send({ id: id });
		}
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
