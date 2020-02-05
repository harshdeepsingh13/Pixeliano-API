const express = require('express');
const {
  registerController,
  verifyEmailController
} = require('./User.controller');

const app = express.Router();

app.post('/register', registerController);
app.get('/verifyEmail', verifyEmailController);

module.exports = app;
