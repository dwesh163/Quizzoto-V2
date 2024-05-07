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
			console.log(session.user.id);
			const rooms = await db
				.collection('rooms')
				.aggregate([
					{
						$match: {
							creator: session.user.id,
						},
					},
					{
						$lookup: {
							localField: 'creator',
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
							comment: 1,
							creator: 1,
							id: 1,
							time: 1,
							title: 1,
							'user.image': 1,
							'user.username': 1,
							_id: 0,
						},
					},
				])
				.toArray();

			return res.status(200).send(rooms);
		}
		if (req.method == 'POST') {
			const user = await db.collection('users').findOne({ email: session.user.email });

			const { title, comment, slug } = JSON.parse(req.body);
			if (!title || !comment || !slug) {
				return res.status(403).send({ error: 'Missing fields' });
			}

			const validSlug = slug.trim().replaceAll(' ', '-').toLowerCase();

			if (/[^a-zA-Z0-9-]/.test(validSlug)) {
				return res.status(403).send({ error: 'Invalid slug' });
			}

			if (validSlug.length < 3 || validSlug.length > 50) {
				return res.status(403).send({ error: 'Slug must be between 3 and 50 characters' });
			}

			if (await db.collection('links').findOne({ slug: validSlug })) {
				return res.status(403).send({ error: 'Slug already exists' });
			}

			const linkId = uuidv4();

			await db.collection('links').insertOne({ linkId: linkId, slug: validSlug, creator: session.user.id, used: 0 });

			const id = uuidv4();

			let room = {
				id: id,
				creator: user.id,
				time: Date.now(),
				title,
				comment,
				linkId,
				quizzes: [],
			};

			db.collection('rooms').insertOne(room);
			return res.status(200).send({ id: id });
		}
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
