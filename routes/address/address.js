var express = require('express');
var router = express.Router();

var db = require('../../libs/db-connect');
var responseFormatter = require('../../utils/responseFormatter/index');
var requestValidator = require('../../utils/requestValidator/index');

var permission = require('../../utils/middleware/permission');

router.get('/street_types', function (req, res, next) {
  return db.any('SELECT * from public.street_types')
    .then(function (response) {
      var opts = {data: {street_types: response}, rc: 0};

      responseFormatter(200, opts, req, res);
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

module.exports = router;