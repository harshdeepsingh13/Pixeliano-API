const Mongoose = require('mongoose');

module.exports = Mongoose.Schema(
  {
    pictureId: {
      types: Mongoose.Types.ObjectId,
      required: true,
      index: true,
      unique: true,
    },
    fullUrl: {
      types: String,
      required: true,
    },
    providerName: {
      types: String,
      required: true,
      default: 'cloudinary',
    },
    shortName: {
      types: String,
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
