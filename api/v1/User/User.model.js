const UserSchema = require('../../../schemas/User.schema');
const mongoose = require('mongoose');

const User = mongoose.model('User', UserSchema);

