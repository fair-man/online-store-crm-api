require('dotenv').config();
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
var fileUpload = require('express-fileupload');

var config = require('./config');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var authorize = require('./utils/middleware/authentication');
var corsAccess = require('./utils/middleware/cors');

var authRouter = require('./routes/auth/auth');
var rolesRouter = require('./routes/role/role');
var usersRouter = require('./routes/user/user');
var addressRouter = require('./routes/address/address');
var provider = require('./routes/provider/provider');
var products = require('./routes/products/products');

var app = express();

app.use(session({
  cookie: config.get('session:cookie'),
  resave: true,
  saveUninitialized: false,
  secret: config.get('session:secret'),
  store: new pgSession()
}));

var corsOptions = {
    origin: 'https://online-store-admin.herokuapp.com',
    // origin: 'http://app.loc:4445',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type', 'x-csrftoken'],
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(authorize);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

router.use('/auth', authRouter);
router.use('/roles', rolesRouter);
router.use('/users', usersRouter);
router.use('/address', addressRouter);
router.use('/providers', provider);
router.use('/products', products);

app.use('/api/v1', router);

module.exports = app;
