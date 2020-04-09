const Mongoose = require('mongoose');

module.exports = Mongoose.Schema(
  {
    resourceId: {
      type: Mongoose.Types.ObjectId,
      required: true,
      index: true,
      unique: true,
    },
    fullUrl: {
      type: String,
      required: true,
    },
    providerName: {
      type: String,
      required: true,
      default: 'cloudinary',
    },
    shortName: {
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
