require('localenv');
let ObjectId = require('mongodb').ObjectId;
function insertKit(db, data) {
	const kitCollection = db.collection(process.env.COLLECTION_KIT);
	data.lastRecord = null;
	return new Promise ((resolve, reject) => {
		kitCollection.insertOne(data)
			.then((doc) => {
				resolve({ error: false, msg: "success!", insertedId: doc.insertedId })
			}).catch((err) => {
				reject({ error: true, msg: "Can't insert!"});
			});
}

function updateKit(db, data) {
	const kitCollection = db.collection(process.env.COLLECTION_KIT);
	return new Promise ((resolve, reject) => {
		kitCollection.updateOne({ data.kitID }, { $set: { "Name" : data.Name, "location": data.location, "lastRecord": ObjectId(data._id) }})
			.then(() => {
				resolve({ error: false, msg: "success!" })
			}).catch((err) => {
				reject({ error: true, msg: "Can't update!"});
			});
}

function removeKit(db, data) {
	const kitCollection = db.collection(process.env.COLLECTION_KIT);
	return new Promise ((resolve, reject) => {
		kitCollection.remove({ data.kitID })
			.then(() => {
				resolve({ error: false, msg: "success!" })
			}).catch((err) => {
				reject({ error: true, msg: "Can't remove!"});
			});
}

function getKit(db, data) {
	const kitCollection = db.collection(process.env.COLLECTION_KIT);
	return new Promise ((resolve, reject) => {
		kitCollection.findOne({ data.kitID })
			.then((info) => {
				resolve( info )
			}).catch((err) => {
				reject({ error: true, msg: "Can't get!"});
			});
}
