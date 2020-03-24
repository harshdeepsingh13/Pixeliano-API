const UserSchema = require('../../../schemas/User.schema');
const mongoose = require('mongoose');

const User = mongoose.model('User', UserSchema);

exports.registerNewUser = async user => {
  const newUser = new User({...user, userId: new mongoose.Types.ObjectId()});
  return newUser.save();
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
  return User.findOne(
    {
      ...matchObject,
    },
    {
      _id: 0,
      ...projection,
    },
  );
};
