require('localenv');
const { updateStation } = require('./station');
const rp = require('request-promise');

let db;

function updateEmb(){
  rp('https://stateair.net/dos/AllPosts24Hour.json').then((html) => {
    const json = JSON.parse(html);
    const last = json.Hanoi.monitors[0].aqi.length - 1;
    updateStation(db, 'Đại sứ quán Mỹ', json.Hanoi.monitors[0].aqi[last]);
  }).catch(err => console.log);
}

function updateMTTD(){
  rp('http://moitruongthudo.vn/api/site')
      .then((html) => {
        const data = JSON.parse(html);
        data.forEach((item, index) => {
          updateStation(db, item.address, parseInt(item.aqi));
        });
      }).catch(err => console.log);
}

function updateAQIVN(){
  rp('http://www.aqivn.org/_ajax/vi/_aqi_head.php')
      .then((html) => {
        const value = parseInt(html.substring(html.indexOf('&nbsp;')+6, html.indexOf(')</h')));
        updateStation(db, 'Cảm biến chất lượng không khí AQIVN.org', value);
      }).catch(err => console.log);
}

//Hàm tự dộng cập nhật dữ liệu trạm, truyền biến db connection
module.export = (db) => {
  setInterval(updateEmb, 300000);
  setInterval(updateMTTD, 300000);
  setInterval(updateAQIVN, 300000);
};