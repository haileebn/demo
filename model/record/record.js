require('localenv');

function insertRecord(db, record) {
  const recordCollection = db.collection(process.env.COLLECTION_RECORD);
  record.time = new Date();
  return new Promise((resolve, reject) => {
    recordCollection.insertOne(record)
        .then((doc) => {
          resolve({error: false, msg: "insert success", kitID: record.kitID, record : { data: record.data, time: record.time } })
        }).catch((err) => {
      reject({error: true, msg: "Can't insert!"});
    })
  });
}

function getRecord(db, recordID) {
  const recordCollection = db.collection(process.env.COLLECTION_RECORD);
  return new Promise((resolve, reject) => {
    recordCollection.findOne({_id: recordID})
        .then((data) => {
          resolve({error: false, msg: "get success", data})
        }).catch((err) => {
      reject({error: true, msg: "Can't GET!"});
    })
  });
}

exports.getRecord = getRecord;
exports.insertRecord = insertRecord;