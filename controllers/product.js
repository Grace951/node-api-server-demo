const Products = require('../models/product');
const Categories = require('../models/category');
const ResError =  require('./util').ResError;
const xss = require('xss');

exports.delete = function (req,res, next){
	req.params.id && (req.params.id = xss(req.params.id));	
	if (!req.user._doc || !req.user._doc.accessRight || req.user._doc.accessRight < 8){
		return res.status(401).json({ errMsg: "Unauthorized"});
	}
	Products.ProductModel.findOneAndRemove( {_id: req.params.id})
		.exec()
		.then(function(product){
			return res.send({name: product.name})
		})
		.catch(function(err){
			console.log(err);
			if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
			return res.status(500).json({ errMsg: "Invalid Form Data"});
		});
}

exports.post_detail = function (req,res){
	req.params.id && (req.params.id = xss(req.params.id));				
	if (!req.user._doc || !req.user._doc.accessRight || req.user._doc.accessRight < 8){
		return res.status(401).json({ errMsg: "Unauthorized"});
	}	
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
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
		return res.status(err.code).json({	errMsg:"Invalid Data"});
	});
}		


exports.get_detail = function (req, res){
	req.params.id && (req.params.id = xss(req.params.id));			
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
			throw new ResError({status: 404, errMsg: "Not Found"});
		}
		return product;
	})
	.then( function(product){
			res.json(product);
	})
	.catch(function(err){
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
		return res.status(500).json({ errMsg: "Internal Server Error"});
	});

}


exports.get_categories = function (req, res){
	// console.log(req.params.id);
		Categories.find({},{})
	.sort({_id: 1}) 
	.exec()
	.then(function(categories){
		if(!categories){
			throw new ResError({status: 404, errMsg: "Not Found"});        
		}
		return categories;
	})
	.then( function(categories){
			res.json(categories);
	})
	.catch(function(err){
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
		returnres.status(500).json({ errMsg: "Internal Server Error"});
	});
}


exports.get_category = function (req, res){
	req.params.id && (req.params.id = xss(req.params.id));		
		Categories.find({categoryName: req.params.id},{_id: true})
	.exec()
	.then(function(category){
		if(!category){
			throw new ResError({status: 404, errMsg: "Not Found"});     
		}
		return category;
	})
	.then( function(category){
		return Products.getBriefObject(category[0]._id);
	})
	.then(function(products){
		if(!products){
			throw new ResError({status: 404, errMsg: "Not Found"});    
		}
		return products;
	})
	.then( function(products){
		res.json(products);
	})
	.catch(function(err){
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
		return res.status(500).json({ errMsg: "Internal Server Error"});
	});;
}