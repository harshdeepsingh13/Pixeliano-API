const {logger} = require('../../../config/config');
const {responseMessages} = require('../../../config/config');
const {saveNewTag, getTags, deleteTag} = require('./Tag.model');

exports.getTagsController = async (req, res, next) => {
  try {
    const {
      q: searchQuery,
    } = req.query;
    const tags = await getTags(searchQuery, false, req.user.email);
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
      data: {
        tags,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.saveNewTagsController = async (req, res, next) => {
  try {
    const {tags} = req.body;
    if (!tags || tags.length === 0 || (tags && !Array.isArray(tags))) {
      req.error = {
        status: 400,
        message: responseMessages[400],
      };
      return next(new Error());
    }
    for (let tag of tags) {
      await saveNewTag({tag, userEmail: req.user.email});
    }
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
    });
  } catch (e) {
    next(e);
  }
};

exports.deleteTagController = async (req, res, next) => {
  try {
    const {tagId} = req.body;
    const {email: userEmail} = req.user;

    if (!tagId) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'Tag id is missing',
      };
      return next(new Error());
    }

    await deleteTag(tagId, userEmail);
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
    });
    logger.info(`[Tag.controller] Tag with tag Id - ${tagId} is deleted successfully.`);
  } catch (e) {
    next(e);
  }
};
