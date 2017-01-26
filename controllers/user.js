let User = require('../models/user');
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
	req.body.email && (nUser.email = req.body.email);
	req.body.profile && (nUser.profile = req.body.profile);
	req.body.data && (nUser.data = req.body.data);
	nUser.save()
	.then( function (user){
		let retUser = {};
		retUser.detials = Object.assign({}, user._doc);
		delete retUser.detials._id;
		delete retUser.detials.__v;
		delete retUser.detials.password;	
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
