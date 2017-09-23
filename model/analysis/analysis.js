require('localenv');
const func = require('../function.js');
let ObjectId = require('mongodb').ObjectId;
function insertAnalysis(db, data) {
  const analysisCollection = db.collection(process.env.COLLECTION_ANALYSIS);
  data.totalRecord = 1;
  return new Promise((resolve, reject) => {
    analysisCollection.insertOne(data)
        .then((doc) => {
          resolve({error: false, msg: "success!", insertedId: doc.insertedId})
        }).catch((err) => {
		  reject({error: true, msg: "Can't insert!"});
		});
  });
}

function updateAnalysis(db, data) {
	const analysisCollection = db.collection(process.env.COLLECTION_ANALYSIS);
	return new Promise ((resolve, reject) => {
		analysisCollection.updateOne({ _id: data._id }, data)
			.then(() => {
				resolve({ error: false, msg: "success!" })
			}).catch((err) => {
				reject({ error: true, msg: "Can't insert!"});
			});
	});
}

function getAnalysis(db, condition) {
  const analysisCollection = db.collection(process.env.COLLECTION_ANALYSIS);
  return new Promise((resolve, reject) => {
    analysisCollection.find(condition).toArray()
        .then((data) => {
          data.forEach((item, index) => {
            delete data[index]._id;
            delete data[index].kitID;
          });
          resolve({ error: false, msg: "success!", analysis: data })
        }).catch((err) => {
		  reject({error: true, msg: "Not found!", err});
		});
  });
}

exports.insertAnalysis = insertAnalysis;
exports.updateAnalysis = updateAnalysis;
exports.getAnalysis = getAnalysis;
