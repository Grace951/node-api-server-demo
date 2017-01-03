/* eslint no-console: 0 */
var express = require('express');
var path = require('path');

var apiPort = process.env.PORT || 3000;
var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use( express.static(path.resolve(__dirname, './public/')));


app.listen(apiPort, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Api listening on port ${apiPort}!`);
  }
});
