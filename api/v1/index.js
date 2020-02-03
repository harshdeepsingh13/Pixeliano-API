const express = require('express');
const user = require('./User')

module.exports = v1Routes => {
  const app = express.Router();
  v1Routes.use('/v1', app);
  app.use('/user', user);
};
