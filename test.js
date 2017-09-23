require('localenv');
const { MongoClient } = require('mongodb');
const { insertStation, getAllStation, updateStation } = require('./model/station/station');
const rp = require('request-promise');

MongoClient.connect(process.env.URL_CONNECT, (err, db) => {
  insertStation(db, { name: 'Đại sứ quán Mỹ', location: [21.0232684,105.8167264], lastRecord: 121}).then(() => {
    insertStation(db, { name: 'Cảm biến chất lượng không khí AQIVN.org', location: [21.0685956,105.8212514], lastRecord: 20}).then(() => {
      rp('http://moitruongthudo.vn/api/site')
          .then(function (htmlString) {
            const data = JSON.parse(htmlString);
            data.forEach((item, index) => {
              insertStation(db, { name: item.address, location: [item.latitude, item.longtitude], lastRecord: parseInt(item.aqi)})
            });
          })
          .catch(function (err) {
            console.log(err);
          });
    }).catch(err => console.log);
  }).catch(err => console.log);

});

