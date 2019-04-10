var express = require('express');
var router = express.Router();

var db = require('../../libs/db-connect');
var responseFormatter = require('../../utils/responseFormatter/index');
var requestValidator = require('../../utils/requestValidator/index');

var roleGetSchema = require('./roleSchema').roleGetSchema;
var roleCreateSchema = require('./roleSchema').roleCreateSchema;
var roleUpdateParamsSchema = require('./roleSchema').roleUpdateParamsSchema;
var roleUpdateBodySchema = require('./roleSchema').roleUpdateBodySchema;
var roleRemoveParamsSchema = require('./roleSchema').roleRemoveParamsSchema;
var permission = require('../../utils/middleware/permission');

router.get('/:r_id', requestValidator.params(roleGetSchema), function (req, res, next) {
  var r_id = req.params.r_id;

  return db.any('SELECT * from public.role_get(${r_id})', {r_id: r_id})
    .then(function (response) {
      var opts = {data: {role: response[0]}, rc: 0};

      responseFormatter(200, opts, req, res);
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.get('/', function (req, res, next) {
  return db.any('SELECT * from public.role_get()')
    .then(function (response) {
      var opts = {data: {roles: response}, rc: 0};

      responseFormatter(200, opts, req, res);
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.post('/', requestValidator.body(roleCreateSchema), function (req, res, next) {
  var r_name = req.body.r_name;

  return db.any('SELECT * FROM public.role_create(${r_name})', {r_name: r_name})
    .then(function (response) {
      var opts = {data: {role: response[0]}, rc: 0};

      responseFormatter(200, opts, req, res)
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.put('/:r_id', requestValidator.params(roleUpdateParamsSchema), requestValidator.body(roleUpdateBodySchema), function (req, res, next) {
  var r_id = req.params.r_id;
  var r_name = req.body.r_name;

  return db.any('SELECT * FROM public.role_update($(r_id), ${r_name})', {r_id: r_id, r_name: r_name})
    .then(function (response) {
      var opts = {data: {role: response[0]}, rc: 0};

      responseFormatter(200, opts, req, res)
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.delete('/:r_id', requestValidator.params(roleRemoveParamsSchema), function (req, res, next) {
  var r_id = req.params.r_id;

  if (!r_id) {
    var opts = {error: 'Не передан обязательный аргумент', rc: 500};

    return responseFormatter(500, opts, req, res);
  }

  return db.any('SELECT * FROM public.role_remove($(r_id))', {r_id: r_id})
    .then(function (response) {
      var opts = {data: {}, rc: 0};

      responseFormatter(200, opts, req, res)
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

module.exports = router;