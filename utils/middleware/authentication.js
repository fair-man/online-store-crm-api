var responseFormatter = require('../responseFormatter/index');
var Enums = require('../../config/enums/index');

module.exports = function authorize(req, res, next) {
  console.log('Проверка авторизации здесь');

  if (req.originalUrl.indexOf('/auth/login') === -1 && req.originalUrl.indexOf('/auth/check_auth') === -1) {
    console.log(req.session);
    if (!req.session.user) {
      var opts = {error: Enums.rcs[401], rc: 401};

      responseFormatter(401, opts, req, res);

      return;
    }

    if (req.headers['x-csrftoken'] !== req.session.csrf_token) {
      var opts = {error: 'token X-CSRFToken is missing', rc: 403};

      responseFormatter(403, opts, req, res);

      return;
    }
  }

  next();
};
