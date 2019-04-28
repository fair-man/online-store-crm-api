var Joi = require('joi');

var userParamsSchema = {
  u_id: Joi.string().required().regex(/^\d+$/)
};

var userCreateSchema = {
  user_json: {
    user_data: {
      first_name: Joi.string().required().trim().min(2).max(60),
      last_name: Joi.string().required().trim().min(2).max(60),
      patronymic_name: Joi.string(),
      birth_date: Joi.string().required(),
      email: Joi.string().required().email(),
      actual_registration_address: Joi.number(),
      role: Joi.number()
    },
    user_data_address_registration: {
      region: Joi.string().required().min(3).max(60),
      district: Joi.string().required().min(3).max(60),
      city: Joi.string().required().min(3).max(60),
      street: Joi.string().required().min(3).max(60),
      street_type: Joi.number().required(),
      building: [Joi.string().optional(), Joi.allow(null)],
      house: Joi.string().required(),
      flat: Joi.string(),
      actual: Joi.number().required(),
      registration: Joi.number().required()
    },
    user_data_address_actual: {
      region: Joi.string().required().min(3).max(60),
      district: Joi.string().required().min(3).max(60),
      city: Joi.string().required().min(3).max(60),
      street: Joi.string().required().min(3).max(60),
      street_type: Joi.number().required(),
      building: [Joi.string().optional(), Joi.allow(null)],
      house: Joi.string().required(),
      flat: Joi.string(),
      actual: Joi.number().required(),
      registration: Joi.number().required()
    },
    user_data_phones: Joi.array().items([{
      phone: Joi.string().required().max(9)
    }])
  }
};

var userUpdateSchema = {
  user_json: {
    user_data: {
      id: Joi.number().required(),
      first_name: Joi.string().required().trim().min(2).max(60),
      last_name: Joi.string().required().trim().min(2).max(60),
      patronymic_name: Joi.string(),
      birth_date: Joi.string().required(),
      email: Joi.string().required().email(),
      actual_registration_address: Joi.number(),
      role: Joi.number()
    },
    user_data_address_registration: {
      id: Joi.number().required(),
      region: Joi.string().required().min(3).max(60),
      district: Joi.string().required().min(3).max(60),
      city: Joi.string().required().min(3).max(60),
      street: Joi.string().required().min(3).max(60),
      street_type: Joi.number().required(),
      building: [Joi.string().optional(), Joi.allow(null)],
      house: Joi.string().required(),
      flat: Joi.string(),
      actual: Joi.number().required(),
      registration: Joi.number().required()
    },
    user_data_address_actual: {
      id: Joi.number().required(),
      region: Joi.string().required().min(3).max(60),
      district: Joi.string().required().min(3).max(60),
      city: Joi.string().required().min(3).max(60),
      street: Joi.string().required().min(3).max(60),
      street_type: Joi.number().required(),
      building: [Joi.string().optional(), Joi.allow(null)],
      house: Joi.string().required(),
      flat: Joi.string(),
      actual: Joi.number().required(),
      registration: Joi.number().required()
    },
    user_data_phones: Joi.array().items([{
      phone: Joi.string().required().max(9)
    }])
  }
};

module.exports = {
  userParamsSchema: userParamsSchema,
  userCreateSchema: userCreateSchema,
  userUpdateSchema: userUpdateSchema
};