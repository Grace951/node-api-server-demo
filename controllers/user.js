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
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
		return res.status(500).json({
			errMsg:"Invalid Data"
		});
	});
}

exports.post_rate = function (req,res){
	if (req.body.rate === undefined ){
		return res.status(500).json({ errMsg: "Plase Provide Rating Number"});
	}
	if (req.params.id === undefined ){
		return res.status(500).json({ errMsg: "Plase Provide Product ID"});
	}
	let id = req.params.id, rate= req.body.rate, nUser = req.user, addVoteCount = 0, oldUserStar = 0, nRate = undefined;
	nUser.rate = nUser.rate || [];
	nUser.data.rate.forEach(function (rate) {
		(rate.productId === id) && (nRate = rate);
	});
	oldUserStar = (nRate && nRate.rate) || 0;

	if (!nRate){
		nRate = {productId : id};
		addVoteCount++;
		nUser.data.rate.push(nRate);
		nRate = undefined;
	}

	let ret = {user_data:{}, product_stars:{}};

	Products.ProductModel.findOne({_id: req.params.id})
	.exec()
	.then( function (details){
		details.stars = details.stars || {totalStars:0, voteCount:0};
		details.stars.totalStars = details.stars.totalStars || 0;
		details.stars.voteCount = details.stars.voteCount || 0;

		details.stars.totalStars += (rate - oldUserStar);
		details.stars.voteCount += addVoteCount;

		return details.save();
	})
	.then( function (details){			
		ret.product_stars = details.stars;
		nRate = nRate || nUser.data.rate[nUser.data.rate.length - 1];
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
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
		return res.status(500).json({
			errMsg:err.toString()
		});
	});
}		



exports.post_favorite = function (req,res){
	if (req.body.love === undefined ){
		return res.status(500).json({ errMsg: "Plase Provide Favorite Status"});
	}	
	if (req.params.id === undefined ){
		return res.status(500).json({ errMsg: "Plase Provide Product ID"});
	}
	let id = req.params.id, fav = req.body.love, nUser = req.user, oldUserfav = false, nFav = undefined;
	nUser.favorite = nUser.favorite || [];
	if (!fav) {   //remove from fav		
		nUser.data.favorite = nUser.data.favorite.filter(function (favorite) {
			!oldUserfav && (oldUserfav = favorite.productId === id);
			return favorite.productId !== id;
		});
	}
	else
	{
		nUser.data.favorite.forEach(function (fav) {
			(fav.productId === id) && (nFav = fav);
		});
		oldUserfav = !!nFav;
		if (!nFav){
			nFav = { productId: id};
			nUser.data.favorite.push(nFav);
			nFav = undefined;
		}
	}

	let ret = {user_data:{}, product_favorite:{}};
	Products.ProductModel.findOne({_id: req.params.id})
	.exec()
	.then( function (details){
		details.favorite = details.favorite || 0;
		if (oldUserfav != fav)	details.favorite += (fav?1:-1);
		details.favorite = ((details.favorite < 0 ) && 0) || details.favorite;
		return details.save();
	})
	.then( function (details){			
		ret.product_favorite = details.favorite;
		if (fav){	
			nFav = nFav || nUser.data.favorite[nUser.data.favorite.length - 1];
			nFav.cat = fav && details.cat;
		}

		return User.findByIdAndUpdate(nUser._id, {data: nUser.data}, {new: true});
	})
	.then( function (user){	
		ret.token = tokenForUser(user);			
		ret.user_data = user._doc.data;
		return res.json(ret);
	})
	.catch(function(err){
		console.log(err);
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
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
