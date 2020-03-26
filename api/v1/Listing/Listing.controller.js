const fs = require('fs');
const path = require('path');
const {responseMessages} = require('../../../config/config');

exports.getListingsController = (req, res, next) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'uesrId missing',
      };
      return next(new Error());
    }
    if (!(
      fs.existsSync(path.join(__dirname, '../../../feeds')) &&
      fs.existsSync(path.join(__dirname, `../../../feeds/${userId}`)) &&
      fs.existsSync(path.join(__dirname, `../../../feeds/${userId}/feed.xml`))
    )) {
      req.error = {
        status: 404,
        message: responseMessages[404],
        logger: 'Either feeds directory or user directory or feed.xml file missing',
      };
      return next(new Error());
    }
    res.sendFile(path.join(__dirname, `../../../feeds/${userId}/feed.xml`));
  } catch (e) {
    next(e);
  }
};
