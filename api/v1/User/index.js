const express = require('express');
const {registerController} = require('./User.controller');

const app = express.Router();

app.post('/register', registerController);

module.exports = app;
