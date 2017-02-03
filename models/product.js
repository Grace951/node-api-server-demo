let mongoose = require('mongoose');
mongoose.Promise = global.Promise

let Schema = mongoose.Schema;

let DocSchema = new Schema({ 
    desc: String,
    size: Number,
    filetype: String,
    src: String    
});

let AlarmMember = new Schema ({
    "desc": String,
    "qty": String
});

let AlarmOptMember = new Schema ({
    "desc": String
});

let SpecMembersSchema = new Schema({ 
    name: String,
    details: String
});


let SpecSchema = new Schema({ 
    name: String,
    members: [SpecMembersSchema]   
});

let StarSchema = new Schema({ 
    totalStars: {
        type: Number ,
        default: 0
    },
    voteCount: {
        type: Number ,
        default: 0
    }
});

let ProductSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        lowercase: true
    },
    cat: {
        type: Number,
        ref:'Category'
    },
    member: [AlarmMember],
    optional: [AlarmOptMember],
    images: [String],
    name: String,
    snippet: String,
    brand: String,
    stars: StarSchema,
    favorite: Number,
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

let ProductModel = mongoose.model('Products', ProductSchema, 'products');

function getBriefObject (id){    
    let category = {"cat": id};
    if (category.cat === 'All')
        delete category.cat;
    
    return ProductModel
        .find(category,{
            docs: false,
            description: false,
            spec: false,
            // _id: false,
            member: false,
            optional: false,
        })
        .sort({brand: 'asc'})        
        // .populate('cat', 'categoryName -_id')
        // .lean()
        .exec();
}


module.exports.ProductModel = ProductModel;
module.exports.getBriefObject = getBriefObject;
