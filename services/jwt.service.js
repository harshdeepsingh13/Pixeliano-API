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

const privateKey = fs.readFileSync(
	path.join(__dirname, './keys/private.key'),
	{
		encoding: 'utf-8'
	}
);

exports.getToken = payload => {
	console.log('getToken', btoa(process.env.PRIVATE_KEY), privateKey);
	return cryptojs.AES.encrypt(jwt.sign(payload, btoa(process.env.PRIVATE_KEY), signOptions), btoa(process.env.PRIVATE_KEY)).toString();
};

exports.getPayload = token => jwt.verify(cryptojs.AES.decrypt(token.toString(), btoa(process.env.PRIVATE_KEY)).toString(cryptojs.enc.Utf8), btoa(process.env.PUBLIC_KEY), verifyOptions);
