const mongoose = require('mongoose');
const APIRequest = mongoose.model('APIRequest', require('../schemas/APIRequest.schema'));

const saveNewRequest = (requestInfo) => {
  const newRequest = new APIRequest({...requestInfo});
  return newRequest.save();
};

module.exports = async (req, res, next) => {
  try {
    const {method, url} = req;
    const {requestId} = await saveNewRequest({method, route: url});
    req.request = {
      callId: requestId,
    };
    next();
  } catch (e) {
    next(e);
  }
};
