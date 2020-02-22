const Mongoose = require('mongoose');

module.exports = Mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      index: true,
      default: new Mongoose.Types.ObjectId(),
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    pictureId: {
      type: Mongoose.Types.ObjectId,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    tags: {
      type: [Mongoose.Types.ObjectId],
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
