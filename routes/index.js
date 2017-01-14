module.exports = function(app){
    var Products = require('../models/product');
    var Categories = require('../models/category');

    app.post('/api/details/:id', function (req,res){
        var product = new Products.ProductModel();
        product.id = req.params.id;
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
         Categories.find({},{}, function(err, categories){
            if(err){
                return res.status(500).json({
                    err:err.toString()
                });
            } else if(!categories){
                return res.status(404).json({
                    err:'Not found'
                });                
            } else{
                res.json(categories);
            }  
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
        }, function(err, product){
            if(err){
                return res.status(500).json({
                    err:err.toString()
                });
            } else if(!product){
                return res.status(404).json({
                    err:'Not found'
                });                
            } else{
                res.json(product);
            }  
        });

    });

    app.get('/api/category/:id', function (req, res){
        // console.log(req.params.id);
        Products.getBriefObject(req.params.id, function (err, product) {
            if(err){
                return res.status(500).json({
                    err:err.toString()
                });
            } else if(!product){
                return res.status(404).json({
                    err:'Not found'
                });                
            } else{
                res.json(product);
            }  
        });
    });

    app.get('*',function(req,res){
        res.send('page not found');
    });

};