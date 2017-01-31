let User = require('../models/user');
const tokenForUser =  require('./util').tokenForUser;

exports.signup = function (req,res, next){
	// res.send({success: true});

	const email = req.body.email;
	const password = req.body.password;
	if(!email || !password){
		return res.status(422).send({errMsg: "Please Provide email or password!!"})
	}

	User.findOne({email}, {password: false}, function(err, user){
		if(err)	return next(err);

		if(user){
			return res.status(422).send({errMsg: "Email is in use!!"})
		}

		const newUser = User({email, password});
		newUser.save( function (err){
			if(err)	return next(err);
			let nUser = Object.assign({}, newUser._doc);
			delete nUser._id;
			delete nUser.__v;
			delete nUser.password;	

			return res.json({token: tokenForUser(newUser), details: nUser});
		});
	});
}
exports.signin = function (req,res, next){
	//user already had their email anf password auth'd
	let nUser = Object.assign({}, req.user._doc);
	delete nUser.password;
	delete nUser._id;
	delete nUser.__v;
	return res.json({token: tokenForUser(req.user), details: nUser});
	//req.user: pass by passpart by done()
}
exports.add_user = function (req,res, next){
	// res.send({success: true});
	if (!req.user._doc || !req.user._doc.accessRight || req.user._doc.accessRight < 8){
		return res.status(401).json({ errMsg: "Unauthorized"});
	}

	const email = req.body.email;
	const password = req.body.password;
	const accessRight = req.body.accessRight;
	if(!email || !password){
		return res.status(422).send({errMsg: "Please Provide email or password!!"})
	}

	User.findOne({email}, {password: false}, function(err, user){
		if(err)	return next(err);

		if(user){
			return res.status(422).send({errMsg: "Email is in use!!"})
		}

		const newUser = User({email, password, accessRight});
		newUser.save( function (err){
			if(err)	return next(err);
			let nUser = Object.assign({}, newUser._doc);
			delete nUser._id;
			delete nUser.__v;
			delete nUser.password;	

			return res.json({token: tokenForUser(newUser), details: nUser});
		});
	});
}
exports.check_auth = function (req,res, next){
	//user already had their email anf password auth'd
	let nUser = Object.assign({}, req.user._doc);
	delete nUser.password;
	delete nUser._id;
	delete nUser.__v;
	return res.json({details: nUser});
	//req.user: pass by passpart by done()
}