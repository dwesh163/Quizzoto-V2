import db from '/lib/mongodb';

export default async function getUserInfo(req, res) {
	try {
		let page = req.query.page - 1;
		const usersPerPage = 20;
		const totalUsers = await db.collection('users').countDocuments();
		const totalPages = Math.ceil(totalUsers / usersPerPage);
		const users = await db
			.collection('users')
			.find(
				{},
				{
					projection: {
						_id: 0,
						username: 1,
						image: 1,
						name: 1,
						statistics: 1,
					},
				}
			)
			.limit(usersPerPage * 5)
			.skip(page * usersPerPage)
			.toArray();

		let usersSeparated = {};
		for (let i = 0; i < users.length; i += usersPerPage) {
			usersSeparated[page] = users.slice(i, i + usersPerPage);
			page++;
		}

		return res.status(200).send({ users: usersSeparated, totalPages: totalPages });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
