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
  const newPost = new Post({...postInfo, postId: new mongoose.Types.ObjectId()});
  return newPost.save();
};

exports.getPosts = async (userEmail) => {
  const [{totalCount}] = await Post.aggregate()
    .match({userEmail})
    .count('totalCount');
  const posts = await Post.aggregate()
    .match({userEmail/*: 'hdsingh2015@gmail.com'*/})
    .lookup({from: 'pictures', localField: 'pictureId', foreignField: 'pictureId', as: 'picture'})
    .unwind('picture')
    .lookup({from: 'tags', localField: 'tags', foreignField: 'tagId', as: 'tags'})
    .project({_id: 0, pictureId: 0, 'picture._id': 0, 'tags._id': 0, userEmail: 0, 'picture.fullUrl': 0})
    .sort({updatedAt: -1});

  return ({
    total: totalCount,
    posts,
  });
};

exports.getTags = (searchQuery = '') =>
  Tag.find(
    {
      tag: new RegExp(`${searchQuery.toLowerCase()}.*`),
    },
    {
      _id: 0,
    },
  ).sort({tag: 1});
