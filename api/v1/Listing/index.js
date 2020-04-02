const app = require('express').Router();

const {getListingsController, getPostsController} = require('./Listing.controller');

app.get('/get/:userId/posts', getListingsController);

app.get('/posts/:offset', getPostsController);

module.exports = app;
