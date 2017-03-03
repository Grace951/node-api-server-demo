require('../database/database');
var Products = require('../models/product');

var Product = require('../backup/products/ALARM.json');

console.log("=================================", Product.length);
for (let i = 0; i < Product.length; i++){
	//console.log("--------------------------------------", Product[i].id);
	Products.ProductModel.update(
		{_id: Product[i]._id},
		Product[i]
		, { multi: true }
		, function(err, numberAffected) {
	     console.log(err, numberAffected);
	});
}

