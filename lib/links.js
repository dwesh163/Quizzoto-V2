import db from './mongodb';

export async function getRedirectUrl(slug) {
	const link = await db.collection('links').findOne({ slug: slug }, { projection: { _id: 0, linkId: 1 } });
	if (!link) {
		return { error: 'No link found' };
	}

	const room = await db.collection('rooms').findOne({ linkId: link.linkId }, { projection: { _id: 0 } });

	let quizzes = [];
	if (room.quizzes) {
		for (const quizId of room.quizzes) {
			const quiz = await db.collection('quizzes').findOne({ id: quizId }, { projection: { _id: 0, questions: 0, date: 0, update: 0 } });
			quizzes.push(quiz);
		}
	}
	if (quizzes.length != 0) {
		return { quizzes: quizzes, room: { id: room.id, title: room.title } };
	} else {
		return { error: 'No quizzes found' };
	}
}
