/* eslint no-console: 0 */
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var route = require('./routes/index');;
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var helmet = require('helmet');
const cors = require('cors');

require('./database/database');
const oneDay = 86400000;
var apiPort = process.env.PORT || 3003;
var app = express();
app.use(helmet());

//app.use(helmet.noCache());
// disable cache manually, because images need to cache

// app.use(helmet.contentSecurityPolicy({
// 	directives: {
// 		defaultSrc: ["'none'"],
// 		scriptSrc: ["'self'", "'unsafe-inline'"],
// 		styleSrc: ["'self'", "'unsafe-inline'"],
// 		imgSrc: ["'self'", "data:"],
// 		fontSrc: ["'self'"],
// 		frameSrc: ["'self'", "https://accounts.google.com/","https://staticxx.facebook.com/"],
// 		connectSrc: ["'self'", "https://react-redux-demo-chingching.herokuapp.com/"],
// 		reportUri: "/cspviolation"
// 	},
// }));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};
app.use(cors(corsOptions));

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     // res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

app.use( express.static(path.resolve(__dirname, './public/'), { maxAge: oneDay * 7 }));
route(app);

app.listen(apiPort, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Api server is listening on port ${apiPort}!`);
  }
});
