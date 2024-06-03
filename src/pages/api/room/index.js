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
						$match: {
							$or: [{ creator: session.user.id }, { 'share.authorized': { $in: [session.user.id] } }],
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
		} else if (req.method == 'POST') {
			const user = await db.collection('users').findOne({ email: session.user.email });

			const { title, comment, slug, instruction, quizzes } = JSON.parse(req.body);
			if (!title || !comment || !slug || title.trim() == '' || comment.trim() == '' || slug.trim() == '') {
				return res.status(403).send({ error: 'Missing fields' });
			}

			const validSlug = slug.trim().replaceAll(' ', '-').toLowerCase();
			const invalidCharacters = validSlug.match(/[^a-zA-Z0-9-]/g);

			if (invalidCharacters) {
				return res.status(403).send({ error: `Invalid characters: ${invalidCharacters.slice(0, 8).join(', ')}` });
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

			let joinId = uuidv4().replace(/-/g, '').slice(0, 8);
			while (await db.collection('rooms').findOne({ joinId })) {
				joinId = uuidv4().replace(/-/g, '').slice(0, 8);
			}

			let room = {
				id: id,
				creator: user.id,
				time: Date.now(),
				title,
				comment,
				instruction: instruction.slice(0, 101),
				linkId,
				quizzes: quizzes,
				parameters: {},
				joinId,
				share: {
					ask: [],
					authorized: [user.id],
				},
			};

			db.collection('rooms').insertOne(room);
			return res.status(200).send({ id: id });
		} else {
			return res.status(405).json({ error: 'Method not allowed' });
		}
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
