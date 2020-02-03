const Mongoose = require('mongoose');

module.exports = Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
