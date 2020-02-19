const mongoose = require('mongoose');

const Picture = mongoose.model('Picture', require('../../../schemas/Picture.schema'));
const Tag = mongoose.model('Tag', require('../../../schemas/Tag.schema'));
const Post = mongoose.model('Post', require('../../../schemas/Post.schema'));

exports.saveNewPicture = pictureInfo => {
  const newPicture = new Picture({...pictureInfo, pictureId: new mongoose.Types.ObjectId()});
  return newPicture.save();
};

exports.saveNewTag = tagInfo => {
  const newTag = new Tag({...tagInfo, tagId: new mongoose.Types.ObjectId()});
  return newTag.save();
};

exports.saveNewPost = postInfo => {
  const newPost = new Post({...postInfo});
  return newPost.save();
};
