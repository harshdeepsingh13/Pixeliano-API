const express = require('express');
const {
  newPostController,
  getPostsController
} = require('./Post.controller');

const app = express.Router();

app.post('/newRecord', newPostController);
app.get('/getAllPosts', getPostsController);

module.exports = app;
