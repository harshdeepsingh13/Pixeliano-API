const {getTagsController, saveNewTagsController, deleteTagController} = require('./Tag.controller');

const app = require('express').Router();

app.get('/getTags', getTagsController);

app.post('/saveTags', saveNewTagsController);

app.delete('/deleteTag', deleteTagController);

module.exports = app;
