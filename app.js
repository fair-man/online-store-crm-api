require('dotenv').config();
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
var cors = require('cors');

var config = require('./config');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var authorize = require('./utils/middleware/authentication');

var rolesRouter = require('./routes/role/role');
var usersRouter = require('./routes/user/user');
var authRouter = require('./routes/auth/login');

var app = express();

app.use(cors({
  origin: 'https://online-store-admin.herokuapp.com',
  credentials: true
}));

app.use(session({
  cookie: config.get('session.cookie'),
  resave: true,
  saveUninitialized: true,
  secret: config.get('session:secret'),
  store: new pgSession()
}));

app.use(function (req, res, next) {
  var origins = [];
  var origin = req.get('origin');

  if (process.env.ALLOW_ORIGIN_ADMIN_DEV) {origins.push(process.env.ALLOW_ORIGIN_ADMIN_DEV);}
  if (process.env.ALLOW_ORIGIN_ADMIN_PROD) {origins.push(process.env.ALLOW_ORIGIN_ADMIN_PROD);}
  // if (process.env.ALLOW_ORIGIN_WEB_DEV) {origins.push(process.env.ALLOW_ORIGIN_WEB_DEV);}
  // if (process.env.ALLOW_ORIGIN_WEB_PROD) {origins.push(process.env.ALLOW_ORIGIN_WEB_PROD);}

  // if (origins.indexOf(origin)) {
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-csrftoken');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(authorize);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

router.use('/roles', rolesRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);

app.use('/api/v1', router);

module.exports = app;
