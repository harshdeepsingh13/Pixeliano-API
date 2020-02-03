const express = require('express');

module.exports = v1Routes => {
  const app = express.Router();
  v1Routes.use('/v1', app);
};
