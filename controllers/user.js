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


exports.get_detail = function (req, res){
	//user already had their email anf password auth'd
	let nUser = Object.assign({}, req.user._doc);
	delete nUser.password;
	delete nUser._id;
	delete nUser.__v;
	return res.json({details: nUser});
	//req.user: pass by passpart by done()

}
