const {saveNewTag} = require('../Post/Post.model');
const {getToken} = require('../../../services/jwt.service');
const {comparePassword, encryptPassword} = require('../../../services/password.service');
const {
  registerNewUser,
  verifyEmail,
  saveDefaultTags,
  getUserDetails,
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
    const [userDetails] = await getUserDetails(email, {email: 1, password: 1, name: 1, userId: 1, defaultTags: 1});
    if (!userDetails) {
      req.error = {
        status: 404,
        message: responseMessages[404],
      };
      return next(new Error());
    }
    if (await comparePassword(userDetails.password, password)) {
      res.status(200).json(
        {
          status: 200,
          message: responseMessages[200],
          data: {
            name: userDetails.name,
            email: userDetails.email,
            token: getToken({email: userDetails.email}),
            userId: userDetails.userId,
            defaultTags: userDetails.defaultTags.map(({tag,tagId}) => ({tag, tagId})),
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
    next(e);
  }
};

exports.saveDefaultTagsController = async (req, res, next) => {
  try {
    const {
      email: userEmail,
    } = req.user;

    let {tags} = req.body;

    if (!Array.isArray(tags) && !tags.length) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'Tags not defined or not an Array',
      };
    }

    tags = await Promise.all(
      tags.map(async tag => {
        if (tag.isNew || !tag.tagId) {
          let tagDetails;
          tagDetails = await saveNewTag({tag: tag.tag});
          return tagDetails.tagId;
        } else {
          return tag.tagId;
        }
      }),
    );

    await saveDefaultTags(userEmail, tags);
    const [{defaultTags}] = await getUserDetails(userEmail, {defaultTags: 1});
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
      data: {
        tags: defaultTags.map(({tag,tagId}) => ({tag, tagId})),
      },
    });
    logger.info(`[User.controller.js] Updated Default Tags saved.`);
  } catch (e) {
    next(e);
  }
};
