let config = require('../config');
const jwt = require('jsonwebtoken'); 

exports.tokenForUser = function (user){
	const timestamp = new Date().getTime();
	// return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
	return jwt.sign({sub: user.id, authType: user.authType, iat: timestamp}, config.secret, { expiresIn: '1h' });
}

