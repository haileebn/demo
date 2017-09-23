require('localenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

MongoClient.connect(process.env.URL_CONNECT, (dbError, db) => {
	const router = require('./routers/router.js')(db);
	if (dbError) {
		console.log(dbError);
	} else {
		console.log("Connected db");
		require('./model/station/cronjob')(db);

		const app = express();
		app.use(express.static(path.join(__dirname, '/public')));
		app.use(bodyParser.json());
		app.use(cookieParser());
		app.set('views', path.join(__dirname, '/views'));
		app.set('view engine', 'pug');

		app.use('/v1', router);
		app.listen(process.env.PORT, () => {
			console.log(`Listent: ${process.env.PORT}`);
		});
	}
});