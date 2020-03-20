const {getToken} = require('../../../services/jwt.service');
const {comparePassword} = require('../../../services/password.service');
const {getUserDetails} = require('./User.model');
const {encryptPassword} = require('../../../services/password.service');
const {
  registerNewUser,
  verifyEmail,
} = require('./User.model');
const {responseMessages, logger} = require('../../../config/config');
exports.registerController = async (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  let {
    password,
  } = req.body;

  if (!name || !email || !password) {
    req.error = {
      status: 400,
      message: responseMessages[400],
    };
    return next(new Error());
  }
  try {
    const user = await getUserDetails(email, {email: 1});
    if (!user) {
      password = await encryptPassword(password);
      await registerNewUser(
        {
          name,
          email,
          password,
        },
      );
      res.status(200).json({
        status: 200,
        message: `${responseMessages[200]}`,
      });
      logger.info(`[ user.controller.js ] User register successfully with email as ${email}`);
    } else {
      req.error = {
        status: 409,
        message: responseMessages[409],
      };
      next(new Error());
    }
  } catch (e) {
    next(e);
  }
};

exports.verifyEmailController = async (req, res, next) => {
  try {
    const {email} = req.query;
    if (!email) {
      req.error = {
        status: 400,
        message: responseMessages[400],
      };
      return next(new Error());
    }
    const userWithEmail = await getUserDetails(email, {email: 1});
    res.status(200).json(
      {
        status: 200,
        message: responseMessages[200],
        data: {
          isEmailPresent: !!userWithEmail,
        },
      },
    );
  } catch (e) {
    next(e);
  }
};

exports.signInUserController = async (req, res, next) => {
  try {
    const {email, password} = req.query;
    if (!email || !password) {
      req.error = {
        status: 400,
        message: responseMessages[400],
      };
      return next(new Error());
    }
    const userDetails = await getUserDetails(email, {email: 1, password: 1, name: 1});
    if (!userDetails) {
      req.error = {
        status: 404,
        message: responseMessages[404],
      };
      return next(new Error());
    }
    if (await comparePassword(userDetails.password, password)) {
      logger.error(`in compare password ${getToken({hello: 'gekki'})}`);
      res.status(200).json(
        {
          status: 200,
          message: responseMessages[200],
          data: {
            name: userDetails.name,
            email: userDetails.email,
            // token: getToken({email: userDetails.email}),
          },
        },
      );
    } else {
      req.error = {
        status: '401',
        message: responseMessages[401],
      };
      return next(new Error());
    }
  } catch (e) {
    logger.error(`signIn error - ${e}`);
    next(e);
  }
};
