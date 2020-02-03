const mongoose = require('mongoose');

const {logger, mongodbConnectionURL} = require('./config');

module.exports = () => {
  mongoose.connect(mongodbConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
    .then(r => logger.info('Connection with DB is successful.'))
    .catch(err => logger.error(`Error in connecting with DB - ${err}`));
};
