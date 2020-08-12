const express = require('express');
const {
  newPostController,
  getPostsController,
  updateRecordController,
  deleteRecordController,
  getPostCountController,
} = require('./Post.controller');

const app = express.Router();

app.post('/newRecord', newPostController);

app.put('/updateRecord', updateRecordController);

app.delete('/record/:postId', deleteRecordController);

app.get('/getAllPosts', getPostsController);

app.get('/getPostCount', getPostCountController);

module.exports = app;
