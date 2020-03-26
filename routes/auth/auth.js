var express = require('express');
var router = express.Router();
var db = require('../../libs/db-connect');
var Enums = require('../../config/enums/index');
var encript = require('../../utils/encript/index');
var responseFormatter = require('../../utils/responseFormatter/index');
var requestValidator = require('../../utils/requestValidator/index');
var loginBodySchema = require('./loginSchema').loginBodySchema;

router.post('/login', requestValidator.body(loginBodySchema), function (req, res, next) {
  var login = req.body.login;
  var password = req.body.password;

  db.any('SELECT * from public.users WHERE users.email = $1' , login).then(
    function (response) {
      var userData = response && response.length && response[0];

      if (userData && encript.checkPassword(password, userData.salt, userData.hashed_password)) {
        db.any('SELECT * from public.user_get(${u_id})', {u_id: userData.id})
          .then(
            function (response) {
              var csrf_token = encript.generateToken();
              var user_data = response[0].user_data;
              user_data.csrf_token = csrf_token;
              var opts = {data: response[0].user_data, rc: 0};

              req.session.user = user_data;
              req.session.csrf_token = csrf_token;

              responseFormatter(Enums.codes.SUCCESS, opts, req, res);
            }
          ).catch(
            function (error) {
              var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

              responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
            }
        )
      } else {
        var opts = {error: Enums.rcs[22], rc: Enums.codes.BAD_REQUEST};

        responseFormatter(Enums.codes.BAD_REQUEST, opts, req, res);
      }
    }
  ).catch(function (error) {
    var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

    responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
  })
});

router.get('/check_auth', function (req, res, next) {
  var user = req.session.user;

  console.log('SESSION => ', req.session);
  console.log('USER => ' ,user);

  if (!user) {
    var opts = {error: Enums.rcs[Enums.codes.NOT_AUTHORIZED], rc: Enums.codes.NOT_AUTHORIZED};

    responseFormatter(Enums.codes.NOT_AUTHORIZED, opts, req, res);
    return;
  }

  db.any('SELECT * from public.user_get(${u_id})', {u_id: user.user_data.id})
    .then(
      function (response) {
        if (response.length) {
          var user_data = response[0].user_data;
          user_data.csrf_token = req.session.csrf_token;

          responseFormatter(Enums.codes.SUCCESS, {data: response[0].user_data, rc: 0}, req, res);
        } else {
          var opts = {error: Enums.rcs[22], rc: Enums.codes.BAD_REQUEST};

          responseFormatter(Enums.codes.BAD_REQUEST, opts, req, res);
        }
      }
    ).catch(
    function (error) {
      var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

      responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
    }
  )
});

router.post('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    var opts = {data: 'Ok', rc: 0};

    res.cookie("connect.sid", "", { expires: new Date() });
    responseFormatter(Enums.codes.SUCCESS, opts, req, res);
  })
});

module.exports = router;
