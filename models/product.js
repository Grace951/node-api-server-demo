var mongoose = require('mongoose');

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
    cat: String,
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

function getBriefObject (id, callback){
    var category = {cat: id};
    if (category.cat === 'All')
        delete category.cat;
    ProductModel
        .find(category,{
            docs: false,
            description: false,
            spec: false,
            _id: false,
            member: false,
            optional: false,           
        })
        .lean()
        .exec(function (err, product) {
            if (err){
              return callback(err, product);
            }

            for (item of product){                
                if(item.images && item.images[0])
                    item.imageUrl = item.images[0]
                delete item.images;   
            }
            return callback(err, product);        
        });
}


module.exports.ProductModel = ProductModel;
module.exports.getBriefObject = getBriefObject;
