import db from './mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function getRedirectUrl(slug) {
	const link = await db.collection('links').findOne({ slug: slug }, { projection: { _id: 0, linkId: 1 } });
	if (!link) {
		return res.status(404).send({ error: 'Link Not Found' });
	}

	const room = await db.collection('rooms').findOne({ linkId: link.linkId }, { projection: { _id: 0 } });

	let quizzes = [];
	if (room.quizzes) {
		for (const quizId of room.quizzes) {
			const quiz = await db.collection('quizzes').findOne({ id: quizId }, { projection: { _id: 0, questions: 0 } });
			quizzes.push(quiz);
		}
	}

	return { url: '/quiz/' + quizzes[0].slug + '/1', room: { id: room.id, title: room.title } };
}
