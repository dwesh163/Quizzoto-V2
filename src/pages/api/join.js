import { getServerSession } from 'next-auth';
import db from '/lib/mongodb';
import { authOptions } from './auth/[...nextauth]';

export default async function getJoinLinks(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).send({ error: 'Sign in' });
	}

	if (req.method === 'POST') {
		try {
			const { joinId } = req.body;

			const room = await db.collection('rooms').findOne({ joinId });

			if (!room) {
				return res.status(400).send({ error: 'Invalid link' });
			}

			let share = room.share || { ask: [], authorized: [] };

			if (share.authorized.includes(session.user.id)) {
				return res.status(200).send({ message: 'redirect', redirect: room.id });
			}

			if (!share.ask.includes(session.user.id)) {
				share.ask.push(session.user.id);

				await db.collection('rooms').updateOne({ joinId }, { $set: { 'share.ask': share.ask } });

				return res.status(200).send({ message: 'Your invitation has been sent' });
			} else {
				return res.status(200).send({ error: 'Invitation already sent' });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).send({ error: 'An error has occurred' });
		}
	} else {
		return res.status(405).send({ error: 'Invalid request method' });
	}
}
