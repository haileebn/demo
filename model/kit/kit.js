require('localenv');
let ObjectId = require('mongodb').ObjectId;

function insertKit(db, data) {
  const kitCollection = db.collection(process.env.COLLECTION_KIT);
  data.lastRecord = null;
  return new Promise((resolve, reject) => {
    kitCollection.insertOne(data)
        .then((doc) => {
          resolve({error: false, msg: "success!", insertedId: doc.insertedId})
        }).catch((err) => {
      reject({error: true, msg: "Can't insert!"});
    });
  });
}

function updateKit(db, kitID, data) {
  const kitCollection = db.collection(process.env.COLLECTION_KIT);
  return new Promise((resolve, reject) => {
    kitCollection.updateOne({ kitID }, data).then(() => {
      resolve({error: false, msg: "success!"})
	}).catch((err) => {
      reject({error: true, msg: "Can't update!"});
    });
  });
}

function removeKit(db, data) {
  const kitCollection = db.collection(process.env.COLLECTION_KIT);
  return new Promise((resolve, reject) => {
    kitCollection.remove({ kitID: data.kitID})
		.then(() => {
      		resolve({error: false, msg: "success!"})
    	}).catch((err) => {
      		reject({error: true, msg: "Can't remove!"});
    	});
  });
}

function getKit(db, data) {
  const kitCollection = db.collection(process.env.COLLECTION_KIT);
  return new Promise((resolve, reject) => {
    kitCollection.findOne({kitID: data.kitID})
  	.then((doc) => {
      resolve({error: false, msg: "success!", doc})
    }).catch((err) => {
      reject({error: true, msg: "Can't get!"});
    });
  });
}

function getAllKit(db) {
  const kitCollection = db.collection(process.env.COLLECTION_KIT);
  return new Promise((resolve, reject) => {
    kitCollection.find().toArray()
    .then((doc) => {
      console.log("success");
      resolve({error: false, msg: "success!", doc})
    }).catch((err) => {
      console.log("err");
      reject({error: true, msg: "Can't get!"});
    });
  });
}

exports.getKit = getKit;
exports.getAllKit = getAllKit;
exports.removeKit = removeKit;
exports.insertKit = insertKit;
exports.updateKit = updateKit;
