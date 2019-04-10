var config = require('../../config');
var crypto = require('crypto');

var encrypt = {
  encryptPassword: function (password, salt) {
    var saltKey = salt || Math.random() + config.get('session:secret');

    return {
      hashed_password: crypto.createHmac('sha1', saltKey).update(String(password)).digest('hex'),
      salt: saltKey
    };
  },
  checkPassword: function (password, salt, hashed_password) {
    return this.encryptPassword(password, salt).hashed_password === hashed_password;
  },
  generateToken: function () {
    return crypto.createHmac('sha1', config.get('session:secret')).update(String(Math.random())).digest('hex')
  }
};

module.exports = encrypt;