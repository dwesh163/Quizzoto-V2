db = db.getSiblingDB('quizzoto');

db.createCollection('users');
db.createCollection('quizzes');
db.createCollection('results');
db.createCollection('rooms');
db.createCollection('links');

db.createUser({
	user: process.env.MONGO_INITDB_USER_USERNAME,
	pwd: process.env.MONGO_INITDB_USER_PASSWORD,
	roles: [{ role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE }],
});
