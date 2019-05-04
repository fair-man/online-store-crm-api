var cloudinary = require('cloudinary').v2;
var config = require('../config');

cloudinary.config({
  cloud_name: config.get('cloudinary:cloudinary_name'),
  api_key: config.get('cloudinary:cloudinary_api_key'),
  api_secret: config.get('cloudinary:cloudinary_api_secret')
});

module.exports = cloudinary;
