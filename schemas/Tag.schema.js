const Mongoose = require('mongoose');

module.exports = Mongoose.Schema(
  {
    tagId: {
      type: Mongoose.Types.ObjectId,
      required: true,
      index: true,
      unique: true,
    },
    tag: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
