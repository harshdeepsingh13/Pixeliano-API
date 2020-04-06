const express = require('express');
const {
  newPostController,
  getPostsController,
  getTagsController,
  saveNewTagsController,
  updateRecordController,
  deleteRecordController,
  getPostCountController
} = require('./Post.controller');

const app = express.Router();

app.post('/newRecord', newPostController);

app.put('/updateRecord', updateRecordController);

app.delete('/record/:postId', deleteRecordController);

app.get('/getAllPosts', getPostsController);

app.get('/getPostCount', getPostCountController);

app.get('/getTags', getTagsController);

app.post('/saveTags', saveNewTagsController);

module.exports = app;
