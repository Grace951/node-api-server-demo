var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Categoryschema = Schema ({
    _id :{
        type: Number,
        unique: true
    },
	categoryName:  {
        type: String,
        unique: true,
        uppercase: true
    },
    imageUrl: Boolean,
    name: Boolean,
    snippet: Boolean,
    brand: Boolean,
    type: Boolean,
    channel: Boolean,
    remote: Boolean,
    backup: Boolean,
    HDD: Boolean,
    videoout: Boolean,
	compression: Boolean,
	sensor: Boolean,
	resolution: Boolean,
	lens: Boolean,
	feature: Boolean,
    desc: Boolean, 
    PoEport: Boolean,
    ir: Boolean,
    io: Boolean,     
});

module.exports = mongoose.model('Category', Categoryschema, 'categories');

