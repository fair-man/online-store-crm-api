var express = require('express');
var router = express.Router();

var db = require('../../libs/db-connect');
var encript = require('../../utils/encript');
var requestValidator = require('../../utils/requestValidator');
var responseFormatter = require('../../utils/responseFormatter');
var userParamsSchema = require('./userSchema').userParamsSchema;
var userCreateSchema = require('./userSchema').userCreateSchema;
var userUpdateSchema = require('./userSchema').userUpdateSchema;
var moment = require('moment');

router.get('/by_role/:r_id', function (req, res, next) {
  var r_id = req.params.r_id;

  return db.any('SELECT * from public.users_get_by_role(${r_id})', {r_id: r_id})
    .then(function (response) {
      var opts = {data: response[0].users, rc: 0};

      responseFormatter(200, opts, req, res);
    }).catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.get('/:u_id', requestValidator.params(userParamsSchema), function (req, res, next) {
  var u_id = req.params.u_id;

  return db.any('SELECT * from public.user_get(${u_id})', {u_id: u_id})
    .then(function (response) {
      var opts = {data: response[0].user_data, rc: 0};

      responseFormatter(200, opts, req, res);
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.post('/', requestValidator.body(userCreateSchema), function (req, res, next) {
  var user_json = req.body.user_json;
  var hash = encript.encryptPassword(user_json.user_data.password);

  delete user_json.user_data.password;

  user_json.user_data.created_date = moment().format('YYYY-MM-DD HH:MM:ss');
  user_json.user_data.salt = hash.salt;
  user_json.user_data.hashed_password = hash.hashed_password;

  return db.any('SELECT * from public.user_create(${user_json})', {user_json: JSON.stringify(user_json)})
    .then(function (response) {
      var opts = {data: response[0].user_data, rc: 0};

      responseFormatter(200, opts, req, res);
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.put('/:u_id', requestValidator.params(userParamsSchema), requestValidator.body(userUpdateSchema), function (req, res, next) {
  var u_id = req.params.u_id;
  var user_json = req.body.user_json;

  return db.any('SELECT * from public.user_update(${u_id}, $(user_json))', {u_id: u_id, user_json: user_json})
    .then(function (response) {
      var opts = {data: response[0].user_data, rc: 0};

      responseFormatter(200, opts, req, res);
    })
    .catch(function (error) {
      var opts = {error: error, rc: 500};

      responseFormatter(500, opts, req, res);
    })
});

router.delete('/:u_id', requestValidator.params(userParamsSchema), function (req, res, next) {
  var u_id = req.params.u_id;

  return db.any('SELECT * from public.user_remove(${u_id})', {u_id: u_id})
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