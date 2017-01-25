let User = require('../models/user');
let config = require('../config');
const jwt = require('jsonwebtoken'); 

function tokenForUser(user){
	const timestamp = new Date().getTime();
	// return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
	return jwt.sign({sub: user.id, iat: timestamp}, config.secret, { expiresIn: '1h' });
}

exports.signup = function (req,res, next){
	// res.send({success: true});

	const email = req.body.email;
	const password = req.body.password;
	if(!email || !password){
		return res.status(422).send({errMsg: "Please Provide email or password!!"})
	}

	User.findOne({email}, function(err, user){
		if(err)	return next(err);

		if(user){
			return res.status(422).send({errMsg: "Email is in use!!"})
		}

		const newUser = User({email, password});
		newUser.save( function (err){
			if(err)	return next(err);	

			return res.json({token: tokenForUser(newUser)});
		});
	});
}
exports.signin = function (req,res, next){
	//user already had their email anf password auth'd
	return res.json({token: tokenForUser(req.user)});
	//req.user: pss by passpart by done()
}