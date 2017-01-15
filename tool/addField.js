require('../database/database');
var Products = require('../models/product');

var CAT = require('../backup/KIT.json');

console.log("=================================", CAT.length);
for (let i = 0; i < CAT.length; i++){
	//console.log("--------------------------------------", CAT[i].id);
	Products.ProductModel.update(
		{id: CAT[i].id},
		CAT[i]
		, { multi: true }
		, function(err, numberAffected) {
	     console.log(err, numberAffected);
	});
}
//mongoimport -h ds019829.mlab.com:19829 -d react-redux-demo -c products -u grace -p 1qazXSW2 --file .\public\json\details\sd4.json
