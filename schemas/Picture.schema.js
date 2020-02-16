const Mongoose = require('mongoose');

module.exports = Mongoose.Schema(
  {
    pictureId: {
      types: Mongoose.Types.ObjectId,
      required: true,
      index: true,
      unique: true,
    },
    full_url: {
      types: String,
      required: true,
    },
    providerName: {
      types: String,
      required: true,
      default: 'cloudinary',
    },
    cloudinaryName: {
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
