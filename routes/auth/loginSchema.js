var Joi = require('joi');

var loginBodySchema = {
  login: Joi.string().required().min(2).max(60),
  password: Joi.string().required().min(2).max(60)
};

module.exports = {
  loginBodySchema: loginBodySchema
};