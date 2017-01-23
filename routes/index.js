let path  = require( 'path');
let mime = require('mime');
let crypto = require('crypto');
let fs = require('fs');

// function HttpErr(code, message) {
//   this.code = code || 500;
//   this.message = message || 'Internal Server Error';
// //   this.stack = (new Error()).stack;
// }
// HttpErr.prototype = Object.create(Error.prototype);
// HttpErr.prototype.constructor = HttpErr;

let multer  = require( 'multer');

let imageStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "../public/img/products"));
    },
    filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(8, function (err, raw) {
            callback(null, (req.body.id || '') + '-' + raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
let docsStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
        let size = file.size;
        callback(null, path.join(__dirname, "../public/docs"));
    },
    filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(8, function (err, raw) {
            callback(null, (req.body.id || '') + '-' + raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
// let upload = multer({ storage : storage }).array('uploadImages', 12);
module.exports = function(app){
    let Products = require('../models/product');
    let Categories = require('../models/category');

    app.delete('/api/details/:id', function (req,res){
        Products.ProductModel.findOneAndRemove( {_id: req.params.id})
        .exec()
        .then(function(product){
            return res.send({name: product.name})
        })
        .catch(function(err){
            console.log(err)
            return res.status(500).json({ errMsg: "Invalid Form Data"});
        });
    })

    .post('/api/file/images/:id', multer({ storage : imageStorage }).array('upload_images', 12), function(req,res,next) {
        if (!req.files){
            return res.status(500).json({ errMsg: "Invalid Form Data"});
        }
        let images = req.files.map((item)=>{ return '/api/img/products/'+item.filename;});        
        let delfiles = JSON.parse(req.body.del_images || "[]") || [];
        if( delfiles && delfiles.length){
            delfiles.forEach( (file) => fs.unlink(`./public/${file.trim().replace(/^\/api\//,'')}`, (err) => { err&&console.log(err);}));
        }
        Products.ProductModel.findOneAndUpdate(
            {_id: req.params.id},
            {$pushAll: { images}}
            , { multi: true , upsert: false, setDefaultsOnInsert: true,  returnNewDocument : false, runValidators: true }
        )
        .exec()
        .then( (images)=> { return res.json(images);})
        .catch(function(err){
            console.log(err);
            return res.status(500).json({
                    errMsg:"Invalid Data"
            });
        });
    })


    .post('/api/file/docs/:id', multer({ storage : docsStorage }).array('upload_docs', 12), function(req,res,next) {
        if (!req.files){            
            return res.status(500).json({ errMsg: "Invalid Form Data"});
        }
        let docs = [];
        for (let file of req.files){
            docs.push({ 
                desc: file.filename,
                size: Math.ceil(file.size/1024),
                filetype: mime.extension(file.mimetype),
                src: '/api/docs/'+file.filename  
            });
        }
        let delDocs = JSON.parse(req.body.del_docs || "[]") || [];
        if( delDocs && delDocs.length){
            delDocs.forEach( (file) => fs.unlink(`./public/${file.src.trim().replace(/^\/api\//,'')}`, (err) => { err&&console.log(err);}));
        }        
        Products.ProductModel.findOneAndUpdate(
            {_id: req.params.id},
            { $pushAll:{docs}}
            , { multi: true , upsert: false, setDefaultsOnInsert: true,  returnNewDocument : false, runValidators: true }
        )
        .exec()
        .then( (docs)=> { return res.json(docs);})
        .catch(function(err){
            console.log(err);
            return res.status(500).json({
                    errMsg:"Invalid Data"
            });
        });
    })

    .post('/api/details/:id', function (req,res){
        Products.ProductModel.findOneAndUpdate(
            {_id: req.params.id},
            req.body
            , { multi: true , upsert: true, setDefaultsOnInsert: true,  returnNewDocument : true, runValidators: true  }
        )
        .exec()
        .then(function(details){
            if(!details){
                return res.send({mode: "insert", data: details})        
            }
            return details;
        })        
        .then(function(details){
            return res.send({mode: "update", data: details})
        })
        .catch(function(err){
            return res.status(err.code).json({
                     errMsg:"Invalid Data"
            });
        });
    })


    .get('/api/details/:id', function (req, res){
        // console.log(req.params.id);
        Products.ProductModel.findOne({
            _id: req.params.id
        },{
            // _id: false,
            // channel: false,
            // remote: false,
            // backup: false,
            // HDD: false,
            // videoout: false,
            // compression: false,
            // sensor: false,
            // resolution: false,
            // lens: false,
            // feature: false,           
        })
        .exec()
        .then(function(product){
            if(!product){
                return res.status(404).json({ errMsg: "Not Found"});
            }
            return product;
        })
        .then( function(product){
                res.json(product);
        })
        .catch(function(err){
            return res.status(500).json({ errMsg: "Internal Server Error"});
        });

    })
    
    .get('/api/categories', function (req, res){
        // console.log(req.params.id);
         Categories.find({},{})
        .sort({_id: 1}) 
        .exec()
        .then(function(categories){
            if(!categories){
                return res.status(404).json({ errMsg: "Not Found"});           
            }
            return categories;
        })
        .then( function(categories){
                res.json(categories);
        })
        .catch(function(err){
            returnres.status(500).json({ errMsg: "Internal Server Error"});
        });
    })


    .get('/api/category/:id', function (req, res){
         Categories.find({categoryName: req.params.id},{_id: true})
        .exec()
        .then(function(category){
            if(!category){
                return res.status(404).json({ errMsg: "Not Found"});          
            }
            return category;
        })
        .then( function(category){
            return Products.getBriefObject(category[0]._id);
        })
        .then(function(products){
            if(!products){
                return res.status(404).json({ errMsg: "Not Found"});         
            }
            return products;
        })
        .then( function(products){
            res.json(products);
        })
        .catch(function(err){
            return res.status(500).json({ errMsg: "Internal Server Error"});
        });;
    })

    .get('*',function(req,res){
        res.send('page not found');
    });

};