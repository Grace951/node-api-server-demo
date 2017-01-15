var mongoose = require('mongoose');
mongoose.Promise = Promise; 

var Schema = mongoose.Schema;

var DocSchema = new Schema({ 
    desc: String,
    size: Number,
    filetype: String,
    src: String    
});


var SpecMembersSchema = new Schema({ 
    name: String,
    details: String
});


var SpecSchema = new Schema({ 
    name: String,
    members: [SpecMembersSchema]   
});

var ProductSchema = new Schema({
    id: {
        type: String,
        unique: true,
        lowercase: true
    },
    cat: {
        type: Number,
        ref:'Category'
    },
    images: [String],
    name: String,
    snippet: String,
    brand: String,
    type: {
        type: String,        
    },
    channel: String,
    remote: String,
    backup: String,
    HDD: String,
    videoout: String,
	compression: String,
	sensor: String,
	resolution: String,
	lens: String,
	feature: String,   
    desc: String, 
    PoEport: String,
    ir: String,
    io: String, 
    docs: [DocSchema],
    description: [String],
    spec: [SpecSchema]
});

var ProductModel = mongoose.model('Products', ProductSchema, 'products');

function getBriefObject (id){    
    var category = {"cat": id};
    if (category.cat === 'All')
        delete category.cat;
    
    return ProductModel
        .find(category,{
            docs: false,
            description: false,
            spec: false,
            _id: false,
            member: false,
            optional: false,
        })
        // .populate('cat', 'categoryName -_id')
        // .lean()
        .exec();
}


module.exports.ProductModel = ProductModel;
module.exports.getBriefObject = getBriefObject;
