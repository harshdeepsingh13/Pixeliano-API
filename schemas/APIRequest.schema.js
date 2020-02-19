const Mongoose = require('mongoose');

module.exports = Mongoose.Schema(
  {
    requestId: {
      type: Mongoose.Types.ObjectId,
      required: true,
      default: new Mongoose.Types.ObjectId(),
    },
    method: {
      type: String,
      required: true,
      default: 'GET',
      enum: [
        'GET',
        'POST',
        'PUT',
        'HEAD',
        'DELETE',
        'PATCH',
        'OPTIONS',
      ],
    },
    route: {
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
