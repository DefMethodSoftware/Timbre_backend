const jwt = require('express-jwt');
const secret = require('../config').secret

function getTokenFromHeader(reg) {
  if (req.headers.authorization && reg.headers.authorization.split(' ')[0] === 'Token') {
    return reg.headers.authorization.split(' ')[1];
  }

  return null;
}

const auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
