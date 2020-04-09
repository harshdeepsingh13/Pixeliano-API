const {cloudinary} = require('../config/config');
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');

const axiosCloudinarySignatureInstance = axios.create();
const axiosCloudinaryBasicAuthInstance = axios.create();

axiosCloudinaryBasicAuthInstance.interceptors.request.use((config) => {
  console.log('test', `${cloudinary.apiKey}:${cloudinary.apiSecret}`);
  config.headers.Authorization = `Basic ${Buffer.from(`${cloudinary.apiKey}:${cloudinary.apiSecret}`).toString('base64').trim()}`.trim();
  return config;
});


axiosCloudinarySignatureInstance.interceptors.request.use((config) => {
  config.transformRequest = (data, headers) => {
    data.api_key = cloudinary.apiKey;
    data.timestamp = Date.now();
    const signatureData = {...data};
    delete signatureData.file;
    delete signatureData.api_key;
    const signatureString = Object.keys(signatureData).sort().map(key => {
      return `${key}=${signatureData[key]}`;
    }).join('&');
    const shasum = crypto.createHash('sha1');
    shasum.update(`${signatureString}${cloudinary.apiSecret}`);
    const signature = shasum.digest('hex');
    // const signature = cryptoJS.SHA1(signatureString);
    console.log('data', signatureData, signatureString, signature);
    data.signature = signature;
    return qs.stringify(data);
  };
  return config;
});

module.exports = {
  axiosCloudinaryBasicAuthInstance,
  axiosCloudinarySignatureInstance
}
