var mongoose = require('mongoose');
var mongodb = require('../config').mongodb;

var dbAdminUser = mongodb.adminUser;
var dbAdminPw = mongodb.adminPW;
var dbHost = mongodb.host;
var dbPort = mongodb.port;
var dbName = mongodb.db;
var dbURI = `mongodb://${dbAdminUser}:${dbAdminPw}@${dbHost}:${dbPort}/${dbName}`;

mongoose.connect(dbURI);

//monitor connect
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + `@${dbHost}:${dbPort}/${dbName}`);
});

//monitor connection error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error  ' + err);
});

