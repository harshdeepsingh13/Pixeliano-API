const app = require('express').Router();

const {getListingsController} = require('./Listing.controller');

app.get('/get/:userId/posts', getListingsController);

module.exports = app;
