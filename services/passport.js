
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const fb = require('../config').ids.facebook;
const google = require('../config').ids.google;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy  = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Create local Strategy
const localOptions = {
	usernameField : 'email',
	//where to find the email, 
	//it will find password field automatically by defaule
};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
	//verify user / pw
	User.findOne({email}, function(err, user){
		if(err)  {  
			console.log(err);
			return done(err, false);    
		}
		if(!user){	
			return done(null, false);	
		}

		user.comparePassword(password, function(err, isMatch){
			if(err) {  
				console.log(err);
				return done(err, false);    
			}
			if(!isMatch){	
				return done(null, false);	
			}
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


const fbLogin = new FacebookStrategy({
    clientID: fb.APP_ID,
    clientSecret: fb.APP_SECRET,
    callbackURL: fb.callbackURL,
	enableProof: true
  },
  function(accessToken, refreshToken, profile, done) {
	  process.nextTick(function () {
			User.findOne({ "socials.facebook_id": profile.id }, function (err, user) {
				if(err)  return done(err, false);
				if(user){
					return done(null, user);
				}
				else{
					// if (!profile.emails || profile.emails.length <= 0 || !profile.emails[0].value){
					// 	return done("Need to Provide Email", false);
					// }
					let newUser = new User();

					// set all of the facebook information in our user model
					newUser.socials.fbId = profile.id || ""; // set the users facebook id                   
					(profile.emails && profile.emails.length > 0 && profile.emails[0].value) && (newUser.email = profile.emails[0].value); // facebook can return multiple emails so we'll take the first
					newUser.profile.username  = profile.displayName || ""; // look at the passport user profile to see how names are returned
					newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?width=10';

					// save our user to the database
					newUser.save(function(err) {
						if (err){
							console.log(err);
							throw err;
						}

						// if successful, return the new user
						// return done(null, {token: accessToken, user: newUser});
						 return done(null, newUser);
					});
				}
			});
	  });
});

const googleLogin = new GoogleStrategy({
    clientID: google.APP_ID,
    clientSecret: google.APP_SECRET,
    callbackURL: google.callbackURL
  },
    function(accessToken, refreshToken, profile, done) {
	  process.nextTick(function () {
		  console.log(profile);
			User.findOne({ "socials.google_id": profile.id }, function (err, user) {
				if(err)  return done(err, false);
				if(user){
					return done(null, user);
				}
				else{
					if (!profile.emails || profile.emails.length <= 0 || !profile.emails[0].value){
						return done("Need to Provide Email", false);
					}
					let newUser = new User();
					
					newUser.socials.googleId    = profile.id;                
					(profile.emails && profile.emails.length > 0 && profile.emails[0].value) && (newUser.email = profile.emails[0].value);
					newUser.profile.username  = profile.displayName; 
					newUser.profile.picture = profile.photos && profile.photos[0] && profile.photos[0].value;

					// save our user to the database
					newUser.save(function(err) {
						if (err)
							throw err;

						// if successful, return the new user
						// return done(null, {token: accessToken, user: newUser});
						 return done(null, newUser);
					});
				}
			});
	  });
});



// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(fbLogin);
passport.use(googleLogin);
