var mongoose = require('mongoose');

var dbURI = "mongodb://grace:1qazXSW2@ds019829.mlab.com:19829/react-redux-demo";

mongoose.connect(dbURI);

//monitor connect
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

//monitor connection error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error  ' + err);
});

