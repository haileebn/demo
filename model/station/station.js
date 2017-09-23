require('localenv');

function insertStation(db, data) {
  const stationCollection = db.collection(process.env.COLLECTION_STATION);
  return new Promise((resolve, reject) => {
    stationCollection.insertOne(data)
        .then((doc) => {
          resolve({error: false, msg: "insert success", insertedId: doc.insertedId})
        }).catch((err) => {
      reject({error: true, msg: "Can't insert!"});
    })
  });
}

function getStation(db, stationID) {
  const stationCollection = db.collection(process.env.COLLECTION_RECORD);
  return new Promise((resolve, reject) => {
    stationCollection.findOne({_id: stationID})
        .then((data) => {
          resolve({error: false, msg: "get success", data})
        }).catch((err) => {
      reject({error: true, msg: "Can't GET!"});
    })
  });
}

function getAllStation(db) {
  const stationCollection = db.collection(process.env.COLLECTION_RECORD);
  return new Promise((resolve, reject) => {
    stationCollection.find({}).toAray()
        .then((station) => {
          resolve({error: false, msg: "get success", station})
        }).catch((err) => {
      reject({error: true, msg: "Can't GET!"});
    })
  });
}

function updateStation(db, name, pm) {
  const stationCollection = db.collection(process.env.COLLECTION_STATION);
  return new Promise((resolve, reject) => {
    stationCollection.updateOne({ name }, { $set: { lastRecord: pm } })
        .then(() => {
          resolve({error: false, msg: "update success"})
        }).catch((err) => {
      reject({error: true, msg: "Can't insert!"});
    })
  });
}

exports.insertStation = insertStation;
exports.getAllStation = getAllStation;
exports.updateStation = updateStation;

