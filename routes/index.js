var path  = require( 'path');

function HttpErr(code, message) {
  this.code = code || 500;
  this.message = message || 'Internal Server Error';
//   this.stack = (new Error()).stack;
}
HttpErr.prototype = Object.create(Error.prototype);
HttpErr.prototype.constructor = HttpErr;

var multer  = require( 'multer');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "../public/img/products"));
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, file.originalname);
    }
});

var upload = multer({ storage : storage }).array('uploadImages', 12);

module.exports = function(app){
    var Products = require('../models/product');
    var Categories = require('../models/category');

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
            upload(req,res,function(err) {
                if(err) {
                    console.log(err);
                    return res.end("Error uploading file.");
                }
                res.end("File is uploaded");
            });
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