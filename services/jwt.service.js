const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cryptojs = require('crypto-js');

const jwtConfig = {
	issuer: 'Harshdeep Singh',
	subject: 'harshdeepsingh13@gmail.com',
	audience: '',
	expiresIn: '12h',
	algorithm: 'RS256',
};

const signOptions = {
	issuer: jwtConfig.issuer,
	subject: jwtConfig.subject,
	audience: jwtConfig.audience,
	// expiresIn: jwtConfig.expiresIn,
	algorithm: jwtConfig.algorithm
};

const verifyOptions = {
	issuer: jwtConfig.issuer,
	subject: jwtConfig.subject,
	audience: jwtConfig.audience,
	// expiresIn: jwtConfig.expiresIn,
	algorithm: [jwtConfig.algorithm]
};


exports.getToken = payload => {
	console.log('getToken', Buffer.from(process.env.PRIVATE_KEY).toString('base64'));
	return cryptojs.AES.encrypt(jwt.sign(payload, Buffer.from(process.env.PRIVATE_KEY).toString('base64'), signOptions), Buffer.from(process.env.PRIVATE_KEY).toString('base64')).toString();
};

exports.getPayload = token => jwt.verify(cryptojs.AES.decrypt(token.toString(), Buffer.from(process.env.PRIVATE_KEY).toString('base64')).toString(cryptojs.enc.Utf8), Buffer.from(process.env.PUBLIC_KEY).toString('base64'), verifyOptions);
