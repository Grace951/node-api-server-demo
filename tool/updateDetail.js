require('../database/database');
var Products = require('../models/product');

var requireDir = require('require-dir');
var details = requireDir('../backup/products/details');



for(let id in details){
	// console.log("--------------------------------------", details[id]);
	Products.ProductModel.update(
		{_id: details[id]._id},
		details[id]
		, { multi: true }
		, function(err, numberAffected) {
	     console.log(err, numberAffected);
	});
}
//mongoimport -h ds019829.mlab.com:19829 -d react-redux-demo -c products -u grace -p 1qazXSW2 --file .\public\json\details\sd4.json