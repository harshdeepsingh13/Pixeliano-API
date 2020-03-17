const express = require('express');
const {
  newPostController,
  getPostsController,
  getTagsController,
  saveNewTagsController,
  updateRecordController,
} = require('./Post.controller');

const app = express.Router();

app.post('/newRecord', newPostController);

app.put('/updateRecord', updateRecordController);

app.get('/getAllPosts', getPostsController);

app.get('/getTags', getTagsController);

app.post('/saveTags', saveNewTagsController);

module.exports = app;
