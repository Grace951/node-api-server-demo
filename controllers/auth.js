const User = require('../models/user');
const tokenForUser =  require('./util').tokenForUser;
const ResError =  require('./util').ResError;
const validateWithProvider =  require('./util').validateWithProvider;
const config = require('../config');

const client_auth_callback = {
	facebook:fb_client_auth_cb,
	google:google_client_auth_cb,
}

function fb_client_auth_cb(user){
	let user_info = {};
	(user.emails && user.emails.length > 0 && user.emails[0].value) && (user_info.email = user.emails[0].value); 
	user_info.username  = user.name || "";
	user_info.picture = 'https://graph.facebook.com/' + user.id + '/picture?width=200';
	user_info.id = user.id;
	return user_info; 
}
function google_client_auth_cb(user){
	let user_info = {};
	(user.email ) && (user_info.email = user.email); 
	user_info.username  = user.name || "";
	user_info.picture = user.picture;
	return user_info;
}
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

exports.client_signin = function (req,res, next){
	if (!req.body.type || !req.body.token || !req.body.id){
		return res.status(422).send({errMsg: "Invalid User Data"});
	}
    let network = req.body.type;
    let socialToken = req.body.token;	
    let Id = req.body.id;
	let email = undefined, username = "", picture ="";
	if (!config.ids[network]){
		return res.status(422).send({errMsg: "Invalid Network Type"});
	}
	let ids = config.ids[network];

	validateWithProvider(socialToken, ids.validateClientURL, ids.APP_QUERYSTR_NAME)
	.then( (response) => {
		let info = client_auth_callback[network](response.data);
		(info.email) && (email = info.email); 
		username  = info.username || ""; 
		picture  = info.picture || ""; 
		if (info.id && info.id != Id)  {throw new ResError({status: 422, errMsg: "Invalid Social ID"});}
		if (info.email) 	{return User.findOne({email}, {password: false});}
		return undefined;
	})
	.then((user)=>{
		if(user)	{throw new ResError({status: 422, errMsg: "Email is in Used"});	}
		return;
	})
	.then(()=>{
		return User.findOne({ [`socials.${network}_id`]: Id });
	})
	.then((user)=>{
		if(user){ 	return (user);	}
		let newUser = new User();
		newUser.profile.picture = picture;
		if (email !== undefined) {newUser.email = email};
		newUser.profile.username = username;
		newUser.socials[`${network}_id`] = Id;
		return newUser.save();
	})
	.then(	(user) => {
		let nUser = Object.assign({}, user._doc);
		delete nUser.password;
		delete nUser._id;
		delete nUser.__v;
		return res.json({token: tokenForUser(user), details: nUser});
	})
	.catch( (err) => {
		if (err.status)   { return res.status(err.status).send({errMsg: err.errMsg});}
		return res.status(500).send({errMsg: err.toString()})
	});
	
}
exports.add_user = function (req,res, next){
	// res.send({success: true});
	if (!req.user._doc || !req.user._doc.accessRight || req.user._doc.accessRight < 8){
		return res.status(401).json({ errMsg: "Unauthorized"});
	}

	let picture = "";
	if( req.file && req.file.filename){		
		picture = '/api/img/users/'+ req.file.filename;
	}
	const email = req.body.email;
	const password = req.body.password;
	const accessRight = parseInt(req.body.accessRight) || 0;
	const username = req.body.username || "";
	if(!email || !password){
		return res.status(422).send({errMsg: "Please Provide email or password!!"})
	}

	User.findOne({email}, {password: false}, function(err, user){
		if(err)	return next(err);

		if(user){
			return res.status(422).send({errMsg: "Email is in use!!"})
		}

		const newUser = User({email, password, accessRight, profile: {username,picture}});
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
	return res.json({token: tokenForUser(req.user), details: nUser});
	//req.user: pass by passpart by done()
}