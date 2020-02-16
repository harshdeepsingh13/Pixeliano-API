const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cryptojs = require('crypto-js');

const publicKey = fs.readFileSync(
	path.join(__dirname, './keys/public.key'),
	{
		encoding: 'utf-8'
	}
);
const privateKey = fs.readFileSync(
	path.join(__dirname, './keys/private.key'),
	{
		encoding: 'utf-8'
	}
);
const jwtConfig = {
	issuer: "Harshdeep Singh",
	subject: "harshdeepsingh13@gmail.com",
	audience: "",
	expiresIn: "12h",
	algorithm: "RS256"
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

exports.getToken = payload => cryptojs.AES.encrypt(jwt.sign(payload, privateKey, signOptions), privateKey).toString();

exports.getPayload = token => jwt.verify(cryptojs.AES.decrypt(token.toString(), privateKey).toString(cryptojs.enc.Utf8), publicKey, verifyOptions);
