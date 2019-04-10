var responseFormatter = require('../responseFormatter/index');
var Enums = require('../../config/enums/index');

module.exports = function authorize(userPermission, permission) {
  console.log('Проверка пермишенов здесь');

  return function (req, res, next) {
    if (userPermission.indexOf(permission) === -1) {
      var opts = {error: Enums.rcs[403], rc: 403};

      responseFormatter(403, opts, req, res);

      return;
    }

    next();
  }
};
