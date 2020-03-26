var responseFormatter = require('../responseFormatter/index');
var Enums = require('../../config/enums/index');

module.exports = function authorize(req, res, next) {
  console.log('~~~AUTH CHECK MIDDLEWARE~~~');

  if (!~['/api/v1/auth/login', '/api/v1/auth/check_auth'].indexOf(req.originalUrl)) {
    if (!req.session.user) {
      console.log('~~~AUTH CHECK MIDDLEWARE => NOT SESSION USER~~~');
      responseFormatter(401, {error: Enums.rcs[401], rc: 401}, req, res);

      return;
    }

    if (req.headers['x-csrftoken'] !== req.session.csrf_token) {
      console.log('~~~AUTH CHECK MIDDLEWARE => NOT X-SCRF TOKEN~~~');
      responseFormatter(403, {error: 'token is missing', rc: 403}, req, res);

      return;
    }
  }

  console.log('~~~AUTH CHECK MIDDLEWARE => NEXT~~~');
  next();
};
