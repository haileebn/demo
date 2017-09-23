require('localenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');


MongoClient.connect(process.env.MONGODB_URL, (dbError, db) => {
	if (dbError) {
		console.log(dbError);
	} else {
		console.log("Connected db");

		const app = express();
		app.use(express.static(path.join(__dirname, '/public')));
		app.use(bodyParser.json());
		app.use(cookieParser());
		app.set('views', path.join(__dirname, '/views'));
		app.set('view engine', 'pug');

		app.use('/');
	}
});