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
    userId: {
      type: Mongoose.Types.ObjectId,
      required: true,
      unique: true,
    },
    xmlId: {
      type: Mongoose.Types.ObjectId,
      unique: true,
      default: null,
    },
    defaultTags: {
      type: [Mongoose.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
