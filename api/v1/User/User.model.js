const UserSchema = require('../../../schemas/User.schema');
const mongoose = require('mongoose');

const User = mongoose.model('User', UserSchema);
const Rss = mongoose.model('Rss', require('../../../schemas/Rss.schema'));

exports.registerNewUser = async user => {
  const newUser = new User({...user, userId: new mongoose.Types.ObjectId()});
  return newUser.save();
};

exports.saveXml = async (xmlData) => {
  const newXml = new Rss({...xmlData, resourceId: new mongoose.Types.ObjectId()});
  return newXml.save();
};

/*exports.verifyEmail = email =>
  User.findOne(
    {
      email,
    },
    {
      email: 1,
    },
  );*/

exports.getUserDetails = (match, projection, matchField = 'email') => {
  const matchObject = {};
  if (matchField === 'email') {
    matchObject.email = match;
  }
  if (matchField === 'userId') {
    matchObject.userId = new mongoose.Types.ObjectId(match);
  }
  if (projection && projection.xml) {
    console.log('matchObject', matchObject);
    return User.aggregate()
      .match({...matchObject})
      .lookup({from: 'rsses', localField: 'xmlId', foreignField: 'resourceId', as: 'xml'})
      .project({_id: 0, ...projection});
  } else {
    return User.findOne(
      {
        ...matchObject,
      },
      {
        _id: 0,
        ...projection,
      },
    );
  }
};

exports.updateXmlId = (match, xmlId, matchField = 'email') => {
  const matchObject = {};
  if (matchField === 'email') {
    matchObject.email = match;
  }
  if (matchField === 'userId') {
    matchObject.userId = new mongoose.Types.ObjectId(match);
  }

  return User.findOneAndUpdate(
    {
      ...matchObject,
    },
    {
      xmlId
    },
    {
      new: true,
      useFindAndModify: false,
    },
  );
};
