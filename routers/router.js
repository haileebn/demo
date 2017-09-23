const express = require('express');
const kit = require('../model/kit/kit.js');
const analysis = require('../model/analysis/analysis.js');
const station = require('../model/station/station.js');
const record = require('../model/record/record.js');
const func = require('../model/function.js');
const router = express.Router();
let db;

function init(conn) {
	db = conn;
	return router;
}

router.get('/kit', (req, res) => {
	kit.getAllKit(db)
		.then((result) => {
			station.getAllStation(db).then((docs) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: false, msg: "Get success!", kit: result.doc, station: docs.station });
			}).catch((err) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: true, msg: "Can't get!"})
			});
		}).catch((err) => {
			res.setHeader('Content-Type', 'application/json');
			res.send({error: true, msg: "Can't get!"})
		});
});

router.post('/kit', (req, res) => {
	if (!req.body) {
		console.log("Can't insert!!");
	} else {
		const body = req.body;
		kit.getKit(db,body)
			.then((result) => {
				if (!result.error) {
					kit.insertKit(db, body)
					.then((data) => {
						res.setHeader('Content-Type', 'application/json');
						res.send({error: false, msg: "Insert success!"});
					}).catch((err) => {
						res.setHeader('Content-Type', 'application/json');
						res.send({error: true, msg: "Can't insert!"})
					});
				} else {
					res.setHeader('Content-Type', 'application/json');
					res.send({error: false, msg: "Can't insert, record had in db!"});
				}
			}).catch((err) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: true, msg: "Can't insert!"})
			});
	}
});

router.put('/kit', (req, res) => {
	if (!req.body) {
		console.log("Can't update!!");
	} else {
		const body = req.body;
		kit.updateKit(db, body.kitID, body)
			.then(() => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: false, msg: "Update success!"});
			}).catch((err) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: true, msg: "Can't update!"});
			});
	}
});

router.delete('/kit', (req, res) => {
	if (!req.body) {
		console.log("Can't delete!!");
	} else {
		const body = req.body;
		kit.removeKit(db, body)
			.then(() => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: false, msg: "Remove success!"});
			}).catch((err) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: true, msg: "Can't remote!"});
			});
	}
});

router.post('/record', (req, res) => {
	record.insertRecord(db, req.body)
		.then((result) => {
				delete record.kitID;
				kit.updateKit(db, result.kitID, { $set: { lastRecord: result.record } })
					.then(() => {
						res.setHeader('Content-Type', 'application/json');
						res.send({error: false, msg: "Insert success!"});
						// console.log();
						// 
						const recordTime = new Date(result.record.time)
					  const date = func.formatDate(recordTime);
					  const hour = recordTime.getHours();
						analysis.getAnalysis(db, { kitID: result.kitID, date, hour })
							.then((ana) => {
									if (ana.data.length === 0) {
										const newAna = {
											kitID: result.kitID,
											date: func.formatDate(result.record.time),
											hour: result.record.time.getHours(),
											data: result.record.data
										}
										analysis.insertAnalysis(db, newAna);
									} else {
										const analysisData = ana.data[0];
										// console.log(ana);
										analysisData.data.pm1 = (analysisData.data.pm1*analysisData.totalRecord+result.record.data.pm1)/(analysisData.totalRecord+1);
										analysisData.data.pm25 = (analysisData.data.pm25*analysisData.totalRecord+result.record.data.pm25)/(analysisData.totalRecord+1);
										analysisData.data.pm10 = (analysisData.data.pm10*analysisData.totalRecord+result.record.data.pm10)/(analysisData.totalRecord+1);
										analysisData.data.temp = (analysisData.data.temp*analysisData.totalRecord+result.record.data.temp)/(analysisData.totalRecord+1);
										analysisData.data.hum = (analysisData.data.hum*analysisData.totalRecord+result.record.data.hum)/(analysisData.totalRecord+1);
										analysisData.totalRecord += 1;
										// console.log(analysisData);
										analysis.updateAnalysis(db, analysisData );
									}
							});
					});
			}).catch((err) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: true, msg: "Can't insert!"});
		});
});

router.get('/analysis/:kitID', (req, res) => {
	const kitID = req.params.kitID;
	const today = new Date();
	const hour = today.getHours();
	const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
	analysis.getAnalysis(db, { 
			kitID, 
			$or: [{ date: func.formatDate(today), hour: { $lte: hour } }, 
						{ date: func.formatDate(yesterday), hour: { $gt: hour } } 
						]
			})
		.then((result) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: false, msg: "Get success!", analysis: result.analysis});
			}).catch((err) => {
				res.setHeader('Content-Type', 'application/json');
				res.send({error: true, msg: "Can't get!"});
		});
});


module.exports = init;