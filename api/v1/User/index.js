const express = require('express');
const {
  registerController,
  verifyEmailController,
  signInUserController,
} = require('./User.controller');

const app = express.Router();

app.post('/register', registerController);
app.get('/verifyEmail', verifyEmailController);
app.get('/signIn', signInUserController);

module.exports = app;
