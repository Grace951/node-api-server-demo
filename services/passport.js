const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local Strategy
const localOptions = {
	usernameField : 'email',
	//where to find the email, 
	//it will find password field automatically by defaule
};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
	//verify user / pw
	User.findOne({email}, function(err, user){
		if(err)  {  return done(err, false);    }
		if(!user){	return done(null, false);	}

		user.comparePassword(password, function(err, isMatch){
			if(err)     {   return done(err, false);    }
			if(!isMatch){	return done(null, false);	}
			return done(null, user);
		})	
	})
});

// Set up options for JWT Strategy
const jwtOptions = {
	jwtFromRequest : ExtractJwt.fromHeader('authorization'),
	//where to find the token
	secretOrKey : config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	User.findById(payload.sub, function(err, user){
		if(err)  return done(err, false);

		if(user){
			return done(null, user);
		}
		else{
			return done(null, false);
		}

	})
});

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);