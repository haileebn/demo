require('localenv');
const request = require('request');
const rp = require('request-promise');
const Promise = require('promise');

const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');
let options = {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    },
    uri: process.env.URL_KIT
};

let options2 = {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
};

app.get('/', (req, res) => {
	res.render('home.pug');
});
app.get('/v1/kit', (req, res) => {
	rp(options)
	  .then(body => {
	    res.send(body);
	  });
});

app.get('/v1/analysis/:kitID', (req, res) => {
	const kitID = req.params.kitID;
	options2.uri = `${process.env.URL_ANALYSIS}/${kitID}`
	rp(options2)
	  .then(body => {
	    res.send(body);
	  });
});

app.get('/v1/kit/:kitID', (req, res) => {
	const kitID = req.params.kitID;
	options2.uri = `${process.env.URL_KIT}/${kitID}`
	rp(options2)
	  .then(body => {
	    res.send(body);
	  });
});

app.listen(process.env.PORT, () => {
	console.log(`Listent: ${process.env.PORT}`);
});