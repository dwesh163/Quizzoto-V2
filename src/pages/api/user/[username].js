import db from '/lib/mongodb';

export default async function getUserInfo(req, res) {
	const user = await db.collection('users').findOne(
		{ username: req.query.username },
		{
			projection: {
				_id: 0,
				username: 1,
				image: 1,
				name: 1,
				statistics: 1,
			},
		}
	);

	return res.status(200).send(user);
}
