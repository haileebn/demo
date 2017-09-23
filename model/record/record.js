require('localenv');

function insertRecord(db, data) {
	const recordCollection = db.collection(process.env.COLLECTION_RECORD);
	data.time = new Date();
	return new Promise ((resolve, reject) => {
		recordCollection.insertOne(data)
			.then((doc) => {
				resolve({ error: false, msg: "insert success", insertedId: doc.insertedId })
			}).catch((err) => {
				reject({ error: true, msg: "Can't insert!"});
			})
}

function getRecord(db, recordID) {
	const recordCollection = db.collection(process.env.COLLECTION_RECORD);
	return new Promise ((resolve, reject) => {
		recordCollection.findOne({ _id:recordID })
			.then((data) => {
				resolve( { error: false, msg: "get success", data } )
			}).catch((err) => {
				reject({ error: true, msg: "Can't GET!"});
			})
}
