var responseFormatter = require('../responseFormatter/index');
var Enums = require('../../config/enums/index');

module.exports = function authorize(req, res, next) {
  if (['/auth/login', '/auth/check_auth'].indexOf(req.originalUrl) !== -1) {
    if (!req.session.user) {
      responseFormatter(401, {error: Enums.rcs[401], rc: 401}, req, res);

      return;
    }

    if (req.headers['x-csrftoken'] !== req.session.csrf_token) {
      responseFormatter(403, {error: 'token is missing', rc: 403}, req, res);

      return;
    }
  }

  next();
};
