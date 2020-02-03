const {encryptPassword} = require('../../../services/password.service');
const {registerNewUser} = require('./User.model');
const {errorMessages, logger} = require('../../../config/config');
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
      message: errorMessages[400],
    };
    return next(new Error());
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
      message: `${errorMessages[200]}`,
    });
    logger.info(`[ user.controller.js ] User register successfully with email as ${email}`);
  } catch (e) {
    next(e);
  }
};
