var Joi = require('joi');

var productGroupsParams = {
	g_id: Joi.number()
};

var productGroupCreateBody = {
	id: Joi.allow(null),
	name: Joi.string().required(),
	description: Joi.string().required()
};

var productCreateSchema = {
	product_json: {
		category_product_id: Joi.number().required(),
		name: Joi.string().required().min(2).max(60),
		description: Joi.string().required().min(2).max(600),
		vendor_code: Joi.string().required().min(2).max(60),
		price: Joi.number().required(),
		count: Joi.number().required(),
		products_groups_description_options: Joi.array().items([{
			name: Joi.string().required().min(2).max(60),
			is_main: Joi.number().optional(),
			options: Joi.array().items([{
				name: Joi.string().required().min(2).max(60),
				value: Joi.string().required().min(2).max(600),
				description: Joi.string().required().min(2).max(600)
			}])
		}])
	}
};

var characteristicGroupCreate = {
    ch_name: Joi.string().required().min(2).max(60),
    ch_description: Joi.string().required().min(2).max(600),
	ch_is_main: Joi.number()
};

module.exports = {
	productCreateSchema: productCreateSchema,
    productGroupsParams: productGroupsParams,
    productGroupCreateBody: productGroupCreateBody,
    characteristicGroupCreate: characteristicGroupCreate
};