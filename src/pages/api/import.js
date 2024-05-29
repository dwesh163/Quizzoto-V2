import { getSession } from 'next-auth/react';
import db from '/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

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

	if (quiz.starter && !quiz.starter.fields) {
		return { code: 400, message: 'The starter fields are missing...' };
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

		if (question.answers.length < 2) {
			error = { code: 400, message: `You miss answers in question ${index + 1}` };
		}
		if (question.answers.length >= 9) {
			error = { code: 400, message: `Too much answers in question ${index + 1}` };
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
		starter: quiz.starter ? quiz.starter : null,
	};

	await db.collection('quizzes').insertOne(newQuiz);
	return { code: 200, message: 'Import success', url: quiz.slug };
}

export default async function handler(req, res) {
	const session = await getSession({ req });
	const quizzesFolderPath = path.join(process.cwd(), 'quizzes');
	try {
		async function listAndOpenAllJsonInQuizzesFolder() {
			const jsonFiles = fs.readdirSync(quizzesFolderPath).filter((file) => path.extname(file) === '.json');

			const errors = [];

			for (const file of jsonFiles) {
				const filePath = path.join(quizzesFolderPath, file);
				const jsonData = fs.readFileSync(filePath, 'utf-8');
				const quiz = JSON.parse(jsonData);

				let error = await insertQuiz(quiz, session);
				error.quiz = quiz.title;
				errors.push(error);
			}
			res.status(200).json({ errors });
		}

		await listAndOpenAllJsonInQuizzesFolder();
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: 'An error has occurred while processing the file...' });
	}
}
