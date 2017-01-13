var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Categoryschema = Schema ({
    id: {
        type: String,
        unique: true,
        lowercase: true
    },
	categoryName: String,
    imageUrl: boolean,
    name: boolean,
    snippet: boolean,
    brand: boolean,
    type: boolean,
    channel: boolean,
    remote: boolean,
    backup: boolean,
    HDD: boolean,
    videoout: boolean,
	compression: boolean,
	sensor: boolean,
	resolution: boolean,
	lens: boolean,
	feature: boolean
});

module.exports = mongoose.model('Category', Categoryschema);

