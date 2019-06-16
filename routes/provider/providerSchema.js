var Joi = require('joi');

var providerParamsSchema = {
    p_id: Joi.string().required()
};

var providerCreateSchema = {
    provider_json: {
        provider_data: {
            id: Joi.allow(null),
            name: Joi.string().required().trim().min(2).max(60),
            email: Joi.string().required().email(),
            status: Joi.number().required(),
            actual_registration_address: Joi.number().required()
        },
        provider_data_address_registration: {
            id: Joi.allow(null),
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
        provider_data_address_actual: {
            id: Joi.allow(null),
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
        provider_data_phones: Joi.array().items([{
            phone: Joi.string().required().min(9),
            type: Joi.number().required()
        }])
    }
};

var providerUpdateSchema = {
    provider_json: {
        provider_data: {
            id: Joi.number().required(),
            name: Joi.string().required().trim().min(2).max(60),
            email: Joi.string().required().email(),
            status: Joi.number().required(),
            actual_registration_address: Joi.number().required()
        },
        provider_data_address_registration: {
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
        provider_data_address_actual: {
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
        provider_data_phones: Joi.array().items([{
            phone: Joi.string().required().min(9),
            type: Joi.number().required()
        }])
    }
};

module.exports = {
    providerParamsSchema: providerParamsSchema,
    providerCreateSchema: providerCreateSchema,
    providerUpdateSchema: providerUpdateSchema
};