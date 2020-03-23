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

exports.getUserDetails = (email, projection) =>
  User.findOne(
    {
      email,
    },
    {
      _id: 0,
      ...projection,
    },
  );
