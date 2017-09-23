require('localenv');
let ObjectId = require('mongodb').ObjectId;

function checkAnalysis(db, data) {
	const analysisCollection = db.collection(process.env.COLLECTION_ANALYSIS);
	const kitID = data.kitID;
	const date = data.date.getDate();
	const hour = data.date.getHours();
	return new Promise ((resolve, reject) => {
		analysisCollection.find({ kitID, date, hour }).count()
			.then((count) => {
				resolve({ error: false, msg: "success!" })
			}).catch((err) => {
				reject({ error: true, msg: "Not found!"});
			});
}

function insertAnalysis(db, data) {
	const analysisCollection = db.collection(process.env.COLLECTION_ANALYSIS);
	data.totalRecord = 0;
	return new Promise ((resolve, reject) => {
		analysisCollection.insertOne(data)
			.then((doc) => {
				resolve({ error: false, msg: "success!", insertedId: doc.insertedId })
			}).catch((err) => {
				reject({ error: true, msg: "Can't insert!"});
			});
}

function updateAnalysis(db, data) {
	const analysisCollection = db.collection(process.env.COLLECTION_ANALYSIS);
	return new Promise ((resolve, reject) => {
		analysisCollection.updateOne({_id: data._id}, data})
			.then(() => {
				resolve({ error: false, msg: "success!" })
			}).catch((err) => {
				reject({ error: true, msg: "Can't insert!"});
			});
}

function getAnalysis(db, data) {
	const analysisCollection = db.collection(process.env.COLLECTION_ANALYSIS);
	const kitID = data.kitID;
	const date = data.date.getDate();
	const hour = data.date.getHours();
	return new Promise ((resolve, reject) => {
		analysisCollection.findOne({ kitID, date, hour })
			.then((data) => {
				resolve({ error: false, msg: "success!", data } )
			}).catch((err) => {
				reject({ error: true, msg: "Not found!"});
			});
}