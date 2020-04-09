const {cloudinary} = require('../config/config');
const qs = require('querystring');
const axios = require('axios');
const {axiosCloudinarySignatureInstance, axiosCloudinaryBasicAuthInstance} = require('./axiosInstance.service');

exports.uploadCloudinaryXml = async (xmlData, userId) => {
  try {
    const bufferData = Buffer.from(xmlData, 'utf8');
    // const bufferData = new Buffer(xmlData, 'utf8');
    const {data} = await axiosCloudinarySignatureInstance({
      method: 'POST',
      url: `${cloudinary.apiURL}raw/upload/`,
      data: {
        file: `data:application/rss+xml;base64,${bufferData.toString('base64')}`,
        folder: `Rss Generator/${process.env.MODE}/feeds/${userId + ''}`,
      },
    });
    return data;
  } catch (e) {
    console.log('sdads', e);
    console.log('eee', e.response.data);
    // throw {
    //   isCloudinaryError: true,
    //   message: 'Resource is larger than 10MB',
    // };
  }
};

exports.getCloudinaryXml = async (publicId) => {
  const {data} = await axios({
    method: 'GET',
    url: `${cloudinary.secureDeliveryURL}${publicId}`,
  });
  return data;
};

exports.deleteFromCloudinary = (publicId, resourceType = 'image') =>
  axiosCloudinaryBasicAuthInstance({
    method: 'DELETE',
    url: `${cloudinary.apiURL}resources/${resourceType}/upload`,
    params: {
      public_ids: [publicId],
    },
  });
