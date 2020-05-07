const {isRSSActive} = require('../../../config/config');
const app = require('express').Router();

const {getListingsController, getPostsController} = require('./Listing.controller');

if (isRSSActive) {
  app.get('/get/:userId/posts', getListingsController);
}

app.get('/posts/:offset', getPostsController);

module.exports = app;
