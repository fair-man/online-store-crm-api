var pgp = require("pg-promise")();
var config = require('../config');

var connect = config.get('postgresql:uri');
var db = pgp(connect);

module.exports = db;