const mongoose = require('mongoose');
const {postsDeliveryLimit} = require('../../../config/config');

const Picture = mongoose.model('Picture', require('../../../schemas/Picture.schema'));
const Tag = mongoose.model('Tag', require('../../../schemas/Tag.schema'));
const Post = mongoose.model('Post', require('../../../schemas/Post.schema'));

exports.saveNewPicture = pictureInfo => {
  const newPicture = new Picture({...pictureInfo, pictureId: new mongoose.Types.ObjectId()});
  return newPicture.save();
};

exports.saveNewPost = postInfo => {
  const newPost = new Post({...postInfo, postId: new mongoose.Types.ObjectId()});
  return newPost.save();
};

exports.updatePost = (postInfo, postId) =>
  Post.findOneAndUpdate(
    {
      postId,
      visible: true,
    },
    {
      ...postInfo,
    },
    {
      new: true,
      useFindAndModify: false,
    },
  );

exports.getPostsCount = (match, matchField = 'userEmail') => {
  const postMatchObject = {
    visible: true,
  };
  if (matchField === 'userEmail') {
    postMatchObject.userEmail = match;
  }
  if (matchField === 'postId') {
    postMatchObject.postId = new mongoose.Types.ObjectId(match);
  }
  return Post.aggregate()
    .match({...postMatchObject})
    .count('totalCount');
};

exports.getPosts = async (match, matchField = 'userEmail', offset = undefined) => {
  const postMatchObject = {
    visible: true,
  };

  if (matchField === 'userEmail') {
    postMatchObject.userEmail = match;
  }
  if (matchField === 'postId') {
    postMatchObject.postId = new mongoose.Types.ObjectId(match);
  }
  const totalCount = await exports.getPostsCount(match, matchField);
  let postsAggregate = Post.aggregate()
    .match({...postMatchObject})
    .lookup({from: 'pictures', localField: 'pictureId', foreignField: 'pictureId', as: 'picture'})
    .unwind('picture')
    .lookup({from: 'tags', localField: 'tags', foreignField: 'tagId', as: 'tags'})
    .project({_id: 0, pictureId: 0, 'picture._id': 0, 'tags._id': 0, userEmail: 0})
    .sort({updatedAt: -1});


  if (offset !== undefined) {
    console.log('limit', postsDeliveryLimit + offset, 'skip', offset);
    postsAggregate
      .limit(postsDeliveryLimit + offset)
      .skip(offset);
  }

  const posts = await postsAggregate;

  return ({
    total: totalCount.length ? totalCount[0].totalCount : totalCount.length,
    posts,
  });
};

exports.setPostOnRss = (postId, rss = false) =>
  Post.findOneAndUpdate(
    {
      postId,
      visible: true,
    },
    {
      rss,
    },
    {
      new: true,
      useFindAndModify: false,
    },
  );

exports.deletePost = (postId, userEmail) =>
  Post.findOneAndUpdate(
    {
      postId,
      userEmail,
      visible: true,
    },
    {
      visible: false,
    },
    {
      new: true,
      useFindAndModify: false,
    },
  );
