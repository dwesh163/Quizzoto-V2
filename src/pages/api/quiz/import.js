import multer from 'multer';
import { getSession } from 'next-auth/react';
import db from '/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

const upload = multer();

export const config = {
	api: {
		bodyParser: false,
	},
};

const uploadMiddleware = upload.single('files');

async function insertQuiz(quiz, session) {
	if (!session) {
		return { code: 401, message: "You don't seem to be connected..." };
	}

	if (quiz.creator != session.user.username) {
		return { code: 403, message: "The creator listed in the JSON doesn't seem to be you..." };
	}

	if (!quiz.slug || !quiz.title || !quiz.description || !quiz.image || !quiz.info || !quiz.creator || !quiz.questions) {
		return { code: 400, message: 'Apparently not everything is here...' };
	}

	const existingSlug = await db.collection('quizzes').findOne({ slug: quiz.slug });

	let error = {};

	quiz.info.points = 0;
	quiz.info.length = quiz.questions.length;
	quiz.questions.map((question, index) => {
		if (parseInt(question.point) < 0 || question.point === '' || question.point === undefined) {
			error = { code: 400, message: `You miss point in question ${index + 1}` };
		} else {
			quiz.info.points += parseInt(question.point);
		}
	});

	if (error.code) {
		return error;
	}

	if (existingSlug) {
		return { code: 400, message: 'The slug must be unique...' };
	}

	const newQuiz = {
		id: uuidv4(),
		slug: quiz.slug,
		title: quiz.title,
		description: quiz.description,
		image: quiz.image,
		info: quiz.info,
		creator: session.user.id,
		questions: quiz.questions,
		type: quiz.type,
		tags: quiz.tags.slice(0, 5),
		rating: '0',
		shuffle: quiz.shuffle ? quiz.shuffle : false,
		date: new Date(),
		update: new Date(),
		visibility: quiz.visibility ? quiz.visibility : 'hidden',
	};

	await db.collection('quizzes').insertOne(newQuiz);
	return { code: 200, message: 'Import success', url: quiz.slug };
}

export default async function handler(req, res) {
	const session = await getSession({ req });
	try {
		await new Promise((resolve, reject) => {
			uploadMiddleware(req, res, (err) => {
				if (err) reject(err);
				resolve();
			});
		});

		const file = req.file;

		if (file && file.mimetype === 'application/json') {
			const jsonData = JSON.parse(file.buffer.toString());
			const response = await insertQuiz(jsonData, session);
			setTimeout(() => {
				res.status(response.code).send(response);
			}, 3000);
		} else {
			res.status(400).json({ message: "Please send a JSON file, as this doesn't appear to be the case..." });
		}
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: 'An error has occurred while processing the file...' });
	}
}
