import db from '/lib/mongodb';

export default async function getUserInfo(req, res) {
	try {
		let page = req.query.page - 1 == -1 ? 0 : req.query.page - 1;
		let search = req.query.search;
		const usersPerPage = 15;
		let query = {};

		if (search != undefined) {
			query = {
				$or: [{ username: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }],
			};
		}

		const totalUsers = await db.collection('users').countDocuments(query);

		if (totalUsers == 0) {
			return res.status(200).send({ users: 'none', totalPages: 0, search: search });
		}
		if (totalUsers == 1) {
			page = 0;
		}

		const totalPages = Math.ceil(totalUsers / usersPerPage);
		const users = await db
			.collection('users')
			.find(query, {
				projection: {
					_id: 0,
					username: 1,
					image: 1,
					name: 1,
					statistics: 1,
				},
			})
			.limit(usersPerPage * 5)
			.skip(page * usersPerPage)
			.toArray();

		let usersSeparated = {};
		for (let i = 0; i < users.length; i += usersPerPage) {
			usersSeparated[page] = users.slice(i, i + usersPerPage);
			page++;
		}

		return res.status(200).send({ users: usersSeparated, totalPages: totalPages, search: search, page: req.query.page - 1 == -1 ? 1 : req.query.page - 1 });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).send('Internal server error');
	}
}
