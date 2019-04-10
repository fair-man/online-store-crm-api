var Joi = require('joi');
var requestValidatorConfig = require('./requestValidatorConfig');

function body(schema) {
  return function (req, res, next) {
    Joi.validate(req.body, schema, requestValidatorConfig, function (err) {
      if (!err) return next();

      res.status(400).send(err)
    })
  }
}

function query(schema) {
  return function (req, res, next) {
    Joi.validate(req.query, schema, requestValidatorConfig, function (err) {
      if (!err) return next();

      res.status(400).send(err)
    })
  }
}

function params(schema) {
  return function (req, res, next) {
    Joi.validate(req.params, schema, requestValidatorConfig, function (err) {
      if (!err) return next();

      res.status(400).send(err)
    })
  }
}

module.exports = { body: body, query: query, params: params };