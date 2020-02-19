const express = require('express');
const {
  newPostController,
} = require('./Post.controller');

const app = express.Router();

app.post('/newRecord', newPostController);

module.exports = app;
