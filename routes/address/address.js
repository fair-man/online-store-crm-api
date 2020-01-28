var express = require('express');
var router = express.Router();

var db = require('../../libs/db-connect');
var responseFormatter = require('../../utils/responseFormatter/index');

var Enums = require('../../config/enums/index');

router.get('/street_types', function (req, res, next) {
  return db.any('SELECT * from public.street_types')
    .then(function (response) {
      var opts = {data: {street_types: response}, rc: 0};

      responseFormatter(Enums.codes.SUCCESS, opts, req, res);
    })
    .catch(function (error) {
      var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

      responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
    })
});

module.exports = router;
