const mongoose = require('mongoose');
const Tag = mongoose.model('Tag', require('../../../schemas/Tag.schema'));

exports.saveNewTag = tagInfo => {
  const newTag = new Tag({...tagInfo, tagId: new mongoose.Types.ObjectId()});
  return newTag.save();
};

exports.getTags = (searchQuery = '', wantExactMatch = false, userEmail) =>
  Tag.find(
    {
      tag: new RegExp(wantExactMatch ? `^${searchQuery}$` : `^${searchQuery}`, 'i'),
      userEmail,
    },
    {
      _id: 0,
    },
  ).sort({tag: 1});


exports.deleteTag = (tagId, userEmail) => Tag.deleteOne({tagId, userEmail});
