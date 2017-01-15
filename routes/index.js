function HttpErr(code, message) {
  this.code = code || 500;
  this.message = message || 'Internal Server Error';
//   this.stack = (new Error()).stack;
}
HttpErr.prototype = Object.create(Error.prototype);
HttpErr.prototype.constructor = HttpErr;


module.exports = function(app){
    var Products = require('../models/product');
    var Categories = require('../models/category');

    app.post('/api/details/:id', function (req,res){
        var product = new Products.ProductModel();
        product.id = req.params.id;
        product.cat = req.body.cat;
        product.name = req.body.name;
        product.brand = req.body.brand;
        product.type = req.body.type;
        product.channel = req.body.channel;
        product.remote = req.body.remote;
        product.backup = req.body.backup;
        product.HDD = req.body.HDD;
        product.videoout = req.body.videoout;
        product.compression = req.body.compression;
        product.sensor = req.body.sensor;
        product.resolution = req.body.resolution;
        product.lens = req.body.lens;
        product.feature = req.body.feature;
        product.desc = req.body.desc;
        product.PoEport = req.body.PoEport;
        product.ir = req.body.ir;
        product.io = req.body.io;

        product.save(function(err,product){
            res.json(product);
        })

    });

    
    app.get('/api/categories', function (req, res){
        // console.log(req.params.id);
         Categories.find({},{})
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
    });

    app.get('/api/details/:id', function (req, res){
        // console.log(req.params.id);
        Products.ProductModel.findOne({
            id: req.params.id
        },{
            _id: false,
            channel: false,
            remote: false,
            backup: false,
            HDD: false,
            videoout: false,
            compression: false,
            sensor: false,
            resolution: false,
            lens: false,
            feature: false,           
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

    });

    app.get('/api/category/:id', function (req, res){
         Categories.find({categoryName: req.params.id},{_id: true}).exec()
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
    });

    app.get('*',function(req,res){
        res.send('page not found');
    });

};