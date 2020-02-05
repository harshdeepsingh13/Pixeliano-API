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
    next(new Error());
  }
  try {
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
      next(new Error());
    }
    const userWithEmail = await verifyEmail(email);
    res.status(200).json(
      {
        status: 200,
        message: responseMessages[200],
        data: {
          isEmailPresent: !!userWithEmail
        }
      },
    );
  } catch (e) {
    next(e);
  }
};
