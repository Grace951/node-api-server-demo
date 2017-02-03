let Products = require('../models/product');
let User = require('../models/user');
let fs = require('fs');
const tokenForUser =  require('./util').tokenForUser;

exports.delete = function (req,res, next){
	User.findOneAndRemove( {
			email: req.body.email
		})
		.exec()
		.then(function(user){
			return res.send({success: true})
		})
		.catch(function(err){
			console.log(err)
			return res.status(500).json({ errMsg: "Invalid Form Data"});
		});
}

exports.post_detail = function (req,res){
	let nUser = req.user;
	if (req.body.accessRight !== undefined && (!req.user._doc || !req.user._doc.accessRight || req.user._doc.accessRight < 8)){
		return res.status(401).json({ errMsg: "Unauthorized"});
	}
	if( req.file && req.file.filename){
		fs.unlink(`./public/${nUser.profile.picture.trim().replace(/^\/api\//,'')}`, (err) => { err&&console.log(err);});
		nUser.profile.picture = '/api/img/users/'+ req.file.filename;
	}
	req.body.accessRight && (nUser.accessRight = req.body.accessRight);
	req.body.email && (nUser.email = req.body.email);
	req.body.password && (nUser.password = req.body.password);	
	req.body.username && (nUser.profile.username = req.body.username);
	req.body.data && (nUser.data = req.body.data);
	nUser.save()
	.then( function (user){
		let retUser = {};
		retUser.details = Object.assign({}, user._doc);
		delete retUser.details._id;
		delete retUser.details.__v;
		delete retUser.details.password;	
		retUser.token = tokenForUser(user);

		return res.json(retUser);
	})
	.catch(function(err){
		return res.status(500).json({
			errMsg:"Invalid Data"
		});
	});
}

exports.post_rate = function (req,res){
	if (!req.body.rate){
		return res.status(500).json({ errMsg: "Plase Provide Rating Number"});
	}
	if (!req.params.id){
		return res.status(500).json({ errMsg: "Plase Provide Product ID"});
	}
	let id = req.params.id, rate= req.body.rate, nUser = req.user, addVoteCount = 0, oldProductStar = 0, nRate = {};
	
	if (!nUser.rate){
		nUser.rate = [];
	}
	nRate = nUser.data.rate.filter(function (rate) {
		return rate.productId === id;
	})[0];

	if (!nRate){
		nRate = {};
		nRate.productId = id;		
		addVoteCount++;
		nUser.data.rate.push(nRate);
	}
	oldProductStar = nRate.rate || 0;

	let ret = {user_data:{}, product_stars:{}};

	Products.ProductModel.findOne({_id: req.params.id})
	.exec()
	.then( function (details){
		if(!details.stars) details.stars = {totalStars:0, voteCount:0};
		if(!details.stars.totalStars) details.stars.totalStars = 0;
		if(!details.stars.voteCount)  details.stars.voteCount = 0;

		details.stars.totalStars += (rate - oldProductStar);
		details.stars.voteCount += addVoteCount;

		return details.save();
	})
	.then( function (details){			
		ret.product_stars = details.stars;
		nRate = nUser.data.rate.filter(function (rate) {
			return rate.productId === id;
		})[0];
		nRate.cat = details.cat;
		nRate.rate = rate;
		
		return User.findByIdAndUpdate(nUser._id, {data: nUser.data}, {new: true});
	})
	.then( function (user){	
		ret.token = tokenForUser(user);			
		ret.user_data = user._doc.data;
		return res.json(ret);
	})
	.catch(function(err){
		console.log(err);
		return res.status(500).json({
			errMsg:err.toString()
		});
	});
}		


exports.get_detail = function (req, res){
	//user already had their email anf password auth'd
	let nUser = Object.assign({}, req.user._doc);
	delete nUser.password;
	delete nUser._id;
	delete nUser.__v;
	return res.json({details: nUser});
	//req.user: pass by passpart by done()

}
