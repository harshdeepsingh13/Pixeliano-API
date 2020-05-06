const express = require('express');
const {
  registerController,
  verifyEmailController,
  signInUserController,
  saveDefaultTagsController
} = require('./User.controller');
const authenticationMiddleware = require('../../../middlewares/authenticationMiddleware');


const app = express.Router();

app.post('/register', registerController);
app.put('/saveDefaultTags', authenticationMiddleware, saveDefaultTagsController);
app.get('/verifyEmail', verifyEmailController);
app.get('/signIn', signInUserController);

module.exports = app;
