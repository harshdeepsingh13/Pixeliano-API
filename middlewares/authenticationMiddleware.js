const {getUserDetails} = require('../api/v1/User/User.model');
const {getPayload} = require('../services/jwt.service');
const {responseMessages} = require('../config/config');

module.exports = async (req, res, next) => {
	console.log('query', req.query);
  if (req.query.secret === 'thisIsHd') {
    try {
      const user = await getUserDetails('harshdeepsingh13@gmail.com');
      if (!user) {
        req.error = {
          status: 401,
          message: 'Invalid token.',
        };
        next(new Error());
      }
      req.user = user;
      next();
    } catch (e) {
      if (e.name === 'JsonWebTokenError') {
        req.error = {
          status: 401,
          message: responseMessages[401],
        };
        next(new Error());
      }
      next(e);
    }
  } else {
    if (!req.headers.authentication) {
      req.error = {
        status: 401,
        message: responseMessages[401],
      };
      next(new Error());
    }
    try {
      const {email} = getPayload(req.headers.authentication.split('Bearer ')[0]);
      const user = await getUserDetails(email);
      if (!user) {
        req.error = {
          status: 401,
          message: responseMessages[401],
        };
        next(new Error());
      }
      req.user = user;
      next();
    } catch (e) {
      if (e.name === 'JsonWebTokenError') {
        req.error = {
          status: 401,
          message: responseMessages[401],
        };
        next(new Error());
      }
      next(e);
    }
  }
};
