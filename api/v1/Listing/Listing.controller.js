const fs = require('fs');
const path = require('path');
const {responseMessages} = require('../../../config/config');
const {getPosts} = require('../Post/Post.model.js');
const {getUserDetails} = require('../User/User.model');
const {getCloudinaryXml} = require('../../../services/cloudinary.service');

const crypto = require('crypto');

const decrypt = (text) => {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(text.key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.getListingsController = async (req, res, next) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      req.error = {
        status: 400,
        message: responseMessages[400],
        logger: 'userId missing',
      };
      return next(new Error());
    }
    const [userDetails] = await getUserDetails(userId, {xml: 1}, 'userId');
    if (userDetails.xml.length) {
      const xmlFeed = await getCloudinaryXml(userDetails.xml[0].shortName);
      res.set('Content-Type', 'application/rss+xml');
      res.send(xmlFeed);
    } else {
      req.error = {
        status: 404,
        message: responseMessages[404],
        logger: 'Either feeds directory or user directory or feed.xml file missing',
      };
      return next(new Error());
    }
  } catch (e) {
    next(e);
  }
};

exports.getPostsController = async (req, res, next) => {
  try {
    const {offset} = req.params;
    const email = decrypt(JSON.parse(process.env.SECRET_TEXT));
    const response = await getPosts(email, 'userEmail', Number(offset));
    res.status(200).json({
      status: 200,
      message: responseMessages[200],
      data: {
        totalPosts: response.total,
        posts: response.posts,
      },
    });
  } catch (e) {
    next(e);
  }
};
