const winston = require('winston');
const {format: {combine, timestamp, printf, colorize}} = require('winston');

const myFormat = printf(({level, message, label, timestamp}) => {
  return `${level} [${timestamp}] ${message}`;
});

module.exports = {
  logger: winston.createLogger({
    format: combine(
      colorize(),
      timestamp(),
      myFormat,
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({filename: 'dev_api.log'}),
    ],
  }),
};
