var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var fs = require('fs');

var cloudinary = require('../../libs/cloudinary-file-upload');
var db = require('../../libs/db-connect');
var encript = require('../../utils/encript');
var requestValidator = require('../../utils/requestValidator');
var responseFormatter = require('../../utils/responseFormatter');
var userParamsSchema = require('./userSchema').userParamsSchema;
var roleParamsSchema = require('./userSchema').roleParamsSchema;
var userCreateSchema = require('./userSchema').userCreateSchema;
var userUpdateSchema = require('./userSchema').userUpdateSchema;
var moment = require('moment');
var config = require('../../config');
var Enums = require('../../config/enums');

router.get('/by_role/:r_id',
    requestValidator.params(roleParamsSchema),
    function (req, res, next) {
      var r_id = req.params.r_id;

      return db.any('SELECT * from public.users_get_by_role(${r_id})', {r_id: r_id})
        .then(function (response) {
          var opts = {data: response[0].users, rc: 0};

          responseFormatter(Enums.codes.SUCCESS, opts, req, res);
        }).catch(function (error) {
          var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

          responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
        })
    });

router.get('/:u_id',
  requestValidator.params(userParamsSchema),
  function (req, res, next) {
    var u_id = req.params.u_id;

    return db.any('SELECT * from public.user_get(${u_id})', {u_id: u_id})
      .then(function (response) {
        var opts = {data: response[0].user_data, rc: 0};

        responseFormatter(Enums.codes.SUCCESS, opts, req, res);
      })
      .catch(function (error) {
        var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

        responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
      });
});

router.post('/',
  requestValidator.body(userCreateSchema),
  function (req, res, next) {
    var user_json = req.body.user_json;
    var password = encript.makePassword();
    var hash = encript.encryptPassword(password);

    user_json.user_data.created_date = moment().format('YYYY-MM-DD HH:mm:ss');
    user_json.user_data.salt = hash.salt;
    user_json.user_data.hashed_password = hash.hashed_password;

    return db.any('SELECT * from public.user_create(${user_json})', {user_json: JSON.stringify(user_json)})
      .then(function (response) {
        var transporter = nodemailer.createTransport(config.get('mailer'));
        var mailOptions = {
          from: config.get('mailer:auth:user'),
          to: user_json.user_data.email,
          subject: 'Регистрация на сайте online-store-admin.herokuapp.com',
          text: 'Успешная регистрация!',
          html: '<h4>Здравствуйте!</h4>' +
          '<div>Для вас была создана учетная запись на сайте ' +
          '<a href="https://online-store-admin.herokuapp.com" target="_blank">online-store-admin.herokuapp.com</a>' +
          ', ваши данные для авторизации:</br></div>' +
          '<div><b>Login:</b> ' + user_json.user_data.email +
          '<br/><b>Password:</b> ' + password + '</div><br/>' +
          '<div>С уважением, администраниция сайта <b>online-store-admin.herokuapp.com</b></div>'
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            var optsError = {error: Enums.rcs[Enums.codes.BAD_REQUEST], rc: Enums.codes.BAD_REQUEST, metaError: error};

            console.log('TransporterError => ', error);

            responseFormatter(Enums.codes.BAD_REQUEST, optsError, req, res);

          } else {
            var optsSuccess = {data: response[0].user_data, rc: 0};

            console.log('Message sent: %s', info.messageId);
            responseFormatter(Enums.codes.SUCCESS, optsSuccess, req, res);
          }
        });
      })
      .catch(function (error) {
        var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

        responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
      });
});

router.post('/avatar_upload/:u_id', function (req, res, next) {
  var u_id = req.params.u_id;
  var name = 'user_' + u_id + '.' + req.files.file_upload.name.split('.')[1];

  req.files.file_upload.mv('./' + name, function(error) {
    if (error) {
      var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

      responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
    } else {
      cloudinary.uploader.upload('./' + name, {
        resource_type: "auto",
        folder: "online-store/users/",
        public_id: 'user_' + u_id,
        width: 354,
        height: 472
      },
      function (error, result) {
        if (error) {
          var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

          responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
        } else {
          db.any('UPDATE public.users SET photo_src = ${src} WHERE users.id = ${u_id}', {src: result.secure_url, u_id: u_id}).then(
            function (response) {
              try {
                fs.unlinkSync('./' + name);
                responseFormatter(Enums.codes.SUCCESS, {data: 'Photo uploaded and drop successfully', rc: 0}, req, res);
              } catch (err) {
                responseFormatter(Enums.codes.SUCCESS, {data: 'Photo uploaded successfully', rc: 0}, req, res);
              }
            }
          ).catch(
            function (error) {
              var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

              responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
            }
          )
        }
      });
    }
  });
});

router.put('/:u_id',
  requestValidator.params(userParamsSchema),
  requestValidator.body(userUpdateSchema),
  function (req, res, next) {
    var u_id = req.params.u_id;
    var user_json = req.body.user_json;

    return db.any('SELECT * from public.user_update(${u_id}, $(user_json))', {u_id: u_id, user_json: user_json})
      .then(function (response) {
        var opts = {data: response[0].user_data, rc: 0};

        responseFormatter(Enums.codes.SUCCESS, opts, req, res);
      })
      .catch(function (error) {
        var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

        responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
      });
    });

router.delete('/:u_id',
  requestValidator.params(userParamsSchema),
  function (req, res, next) {
    var u_id = req.params.u_id;

    return db.any('SELECT * from public.user_remove(${u_id})', {u_id: u_id})
      .then(function (response) {
        var opts = {data: {}, rc: 0};

        responseFormatter(Enums.codes.SUCCESS, opts, req, res)
      })
      .catch(function (error) {
        var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

        responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
      });
});

module.exports = router;
