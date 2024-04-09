const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = `mongodb://${process.env.MONGO_INITDB_USER_USERNAME}:${process.env.MONGO_INITDB_USER_PASSWORD}@quizzoto_db:27017/${process.env.MONGO_INITDB_DATABASE}?directConnection=true`;
const client = new MongoClient(url);
const dbName = `${process.env.MONGO_INITDB_DATABASE}`;

client.connect();
const db = client.db(dbName);

module.exports = db;
