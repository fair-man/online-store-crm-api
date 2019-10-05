var Joi = require('joi');

var productGroupsParams = {
	g_id: Joi.number()
};

var productCategoryParams = {
    c_id: Joi.number()
};

var productGroupCreateBody = {
	g_id: Joi.allow(null),
	g_name: Joi.string().required(),
	g_description: Joi.string().required()
};

var productSubGroupCreateBody = {
	gs_id: Joi.allow(null),
    gs_group_category_id: Joi.allow(null),
    gs_name: Joi.string().required(),
    gs_description: Joi.string().required()
};

var productSubGroupUpdateBody = {
	gs_id: Joi.number().required(),
    gs_group_category_id: Joi.allow(null),
    gs_name: Joi.string().required(),
    gs_description: Joi.string().required()
};

var characteristicGroupCreate = {
    ch_name: Joi.string().required().min(2).max(60),
    ch_description: Joi.string().required().min(2).max(600),
    ch_is_main: Joi.number(),
    ch_sort_order: Joi.number()
};

var characteristicGroupUpdate = {
	ch_id: Joi.number().required(),
    ch_name: Joi.string().required().min(2).max(60),
    ch_description: Joi.string().required().min(2).max(600),
    ch_is_main: Joi.number(),
    ch_sort_order: Joi.number()
};

var categoryCreate = {
	c_id: Joi.allow(null),
    c_group_subcategory_id: Joi.number().required(),
    c_name: Joi.string().required().min(2).max(60),
    c_description: Joi.string().required().min(2).max(600)
};

var categoryUpdate = {
    c_id: Joi.number().required(),
    c_group_subcategory_id: Joi.number().required(),
    c_name: Joi.string().required().min(2).max(60),
    c_description: Joi.string().required().min(2).max(600)
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

module.exports = {
    productGroupsParams: productGroupsParams,
    productCategoryParams: productCategoryParams,
    productGroupCreateBody: productGroupCreateBody,
    productSubGroupCreateBody: productSubGroupCreateBody,
    productSubGroupUpdateBody: productSubGroupUpdateBody,
	productCreateSchema: productCreateSchema,
    characteristicGroupCreate: characteristicGroupCreate,
    categoryCreate: categoryCreate,
    categoryUpdate: categoryUpdate,
    characteristicGroupUpdate: characteristicGroupUpdate
};