module.exports = function(app){
    var Products = require('../models/product');

    app.post('/addproduct', function (req,res){
        var product = new Products();
        product.name = req.body.name;
        product.save(function(err,product){
            res.json({
                product:product
            });
        })

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