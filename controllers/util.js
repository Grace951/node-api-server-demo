var axios = require("axios");
let config = require('../config');
const jwt = require('jsonwebtoken'); 

exports.tokenForUser = function (user){
	const timestamp = new Date().getTime();
	// return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
	return jwt.sign({sub: user._id, iat: timestamp}, config.secret, { expiresIn: '1h' });
}

exports.validateWithProvider = function(socialToken, url, qs) {
	return axios.get(url, {
		params: {
			[qs]: socialToken
		}
	});
}


function ResError({status,errMsg}) {
  this.status = status || 500;
  this.errMsg = errMsg || 'Internal Server Error';
  this.stack = (new Error()).stack;
}
ResError.prototype = Object.create(Error.prototype);
ResError.prototype.constructor = ResError;

exports.ResError = ResError;

