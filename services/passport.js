const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Set up options for JWT Strategy
const jwtOption = {
	jwtFromRequest : ExtractJwt.fromHeader('authorization'),
	//where to find the token
	secretOrKey : config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOption, function(payload, done){
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