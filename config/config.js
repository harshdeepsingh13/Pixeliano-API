const winston = require('winston');
const {format: {combine, timestamp, printf, colorize}} = require('winston');

const myFormat = printf(({level, message, label, timestamp}) => {
  return `${level} [${timestamp}] ${message}`;
});

let mongodbConnectionURL = 'mongodb://localhost:27017/rss-gen';

if (process.env.MODE === 'herokudev' || process.env.MODE === 'prod') {
  mongodbConnectionURL = process.env.MONGODB_URI;
}

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
  mongodbConnectionURL,
  responseMessages: {
    '400': 'Bad Request',
    '200': 'Success',
    '404': 'Not Found',
    '401': 'Unauthorized',
    '409': 'Conflict',
  },
  postsDeliveryLimit: 10,
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    secureDeliveryURL: 'https://res.cloudinary.com/harshdeep-singh/raw/upload/',
    apiURL: 'https://api.cloudinary.com/v1_1/harshdeep-singh/',
    uploadPreset: `pixeliano_preset_${process.env.MODE}`
  }
};
