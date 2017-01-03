/* eslint no-console: 0 */
var express = require('express');
var path = require('path');

var apiPort = process.env.PORT || 3000;
var app = express();
app.use( express.static(path.resolve(__dirname, './public/')));

app.listen(apiPort, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Api listening on port ${apiPort}!`);
  }
});
