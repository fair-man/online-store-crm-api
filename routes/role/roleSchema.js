var Joi = require('joi');

var roleGetSchema = {
  r_id: Joi.string().required().regex(/^\d+$/)
};

var roleCreateSchema = {
  r_name: Joi.string().required().min(2).max(60)
};

var roleUpdateParamsSchema = {
  r_id: Joi.string().required().regex(/^\d+$/)
};

var roleUpdateBodySchema = {
  r_name: Joi.string().required().min(2).max(60)
};

var roleRemoveParamsSchema = {
  r_id: Joi.string().required().regex(/^\d+$/)
};

module.exports = {
  roleGetSchema: roleGetSchema,
  roleCreateSchema: roleCreateSchema,
  roleUpdateParamsSchema: roleUpdateParamsSchema,
  roleUpdateBodySchema: roleUpdateBodySchema,
  roleRemoveParamsSchema: roleRemoveParamsSchema
};