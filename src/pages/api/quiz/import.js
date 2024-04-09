import multer from 'multer';
import { getSession } from 'next-auth/react';

const upload = multer();

export const config = {
	api: {
		bodyParser: false,
	},
};

const uploadMiddleware = upload.single('files');

export default async function handler(req, res) {
	const session = await getSession({ req });
	console.log(session);
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
			setTimeout(() => {
				res.status(200).send('ok');
			}, 5000);
		} else {
			res.status(400).json({ message: 'Veuillez envoyer un fichier JSON.' });
		}
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: 'Une erreur est survenue lors du traitement du fichier.' });
	}
}
