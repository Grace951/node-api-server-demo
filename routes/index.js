let path  = require( 'path');
let mime = require('mime');
let crypto = require('crypto');
let fs = require('fs');

function HttpErr(code, message) {
  this.code = code || 500;
  this.message = message || 'Internal Server Error';
//   this.stack = (new Error()).stack;
}
HttpErr.prototype = Object.create(Error.prototype);
HttpErr.prototype.constructor = HttpErr;

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
            return res.status(500).json(err);
        });
    })

    .post('/api/file/images/:id', function (req,res){    
        let  id =   req.params.id
        Products.ProductModel.findOne(
            {_id: id}           
        )
        .exec()
        .then(function(details){
            if(!details){
               throw new HttpErr(404, 'Product Not Found');   
            }
            return details;
        })
        .then(function(details){
             console.log(req.body);
            return new Promise((resolve, reject) => {
                multer({ storage : imageStorage }).array('upload_images', 12)(req,res,function(err) {
                    if (err){ 
                        console.log(err);
                        reject(new Error(err));
                    }
                    let delimages = JSON.parse(req.body.del_images || "[]") || [];
                    if( delimages && delimages.length){
                        delimages.forEach( (file) => fs.unlink(`./public/${file.trim().replace(/^\/api\//,'')}`, (err) => { err&&console.log(err);}));
                    }
                   
                    let filenames = req.files.map((item)=>{ return '/api/img/products/'+item.filename;});
                    
                    for (let file of filenames){
                        details.images.push(file);
                    }
                   
                    details.save((done)=>{console.log(done)});
                    resolve(details);
                });
            });
        })
        // .then( function(ret ){  
        //     let {filenames, details} = ret;
        //     return Products.ProductModel.update(
        //         {_id: id}, 
        //         { $pushAll: { images: filenames } }
        //     );             
        // })
        .then(function(details){
            res.end("File is uploaded");
            console.log('File is uploaded');
        })
        .catch(function(err){
            return res.status(err.code).json({
                    err:err.message
            });
        });
    })

    .post('/api/file/docs/:id', function (req,res){      
        Products.ProductModel.find(
            {_id: req.params.id}           
        )
        .exec()
        .then(function(details){
            if(!details){
               throw new HttpErr(404, 'Product Not Found');   
            }
            return details;
        })
        .then(function(details){
            return new Promise((resolve, reject) => {
                multer({ storage : imageStorage }).array('upload_docs', 12)(req,res,function(err) {
                    if (err){ 
                        console.log(err);
                        reject(new Error(err));
                    }
                    let docs = req.files.map((item)=>{ return '/api/docs/'+item.filename;})                    
                    resolve({docs, details});
                });
            });
        })        
        .then( function(ret ){  
            let {filenames, details} = ret;
            return Products.ProductModel.update(
                {_id: id}, 
                { $pushAll: { docs: filenames } }
            );             
        })
        .then(function(details){
            res.end("File is uploaded");
            console.log('File is uploaded');
        })
        .catch(function(err){
            return res.status(err.code).json({
                    err:err.message
            });
        });
    })

    .post('/api/details/:id', function (req,res){
        Products.ProductModel.findOneAndUpdate(
            {_id: req.params.id},
            req.body
            , { multi: true , upsert: true, setDefaultsOnInsert: true,  returnNewDocument : true }
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
                    err:err.message
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
                throw new HttpErr(404, 'Not Found');               
            }
            return product;
        })
        .then( function(product){
                res.json(product);
        })
        .catch(function(err){
            return res.status(err.code).json({
                    err:err.message
            });
        });

    })
    
    .get('/api/categories', function (req, res){
        // console.log(req.params.id);
         Categories.find({},{})
        .sort({_id: 1}) 
        .exec()
        .then(function(categories){
            if(!categories){
                throw new HttpErr(404, 'Not Found');               
            }
            return categories;
        })
        .then( function(categories){
                res.json(categories);
        })
        .catch(function(err){
            return res.status(err.code).json({
                    err:err.message()
            });
        });
    })


    .get('/api/category/:id', function (req, res){
         Categories.find({categoryName: req.params.id},{_id: true})
        .exec()
        .then(function(category){
            if(!category){
                throw new HttpErr(404, 'Not Found');               
            }
            return category;
        })
        .then( function(category){
            return Products.getBriefObject(category[0]._id);
        })
        .then(function(products){
            if(!products){
                throw new HttpErr(404, 'Not Found');                
            }
            return products;
        })
        .then( function(products){
            res.json(products);
        })
        .catch(function(err){
            return res.status(err.code).json({
                    err:err.message()
            });
        });;
    })

    .get('*',function(req,res){
        res.send('page not found');
    });

};