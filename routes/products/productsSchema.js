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

var productCreateSchema = {
    product_json: {
        category_product_id: Joi.number().required(),
        name: Joi.string().required().min(2).max(60),
        description: Joi.string().required().min(2).max(600),
        vendor_code: Joi.string().required().min(2).max(60),
        price: Joi.number().required(),
        count: Joi.number().required(),
        products_groups_description_options: Joi.array().items([{
            id: Joi.number().required(),
            sort_order: Joi.number().required(),
            options: Joi.array().items([{
                name: Joi.string().required().min(2).max(60),
                value: Joi.string().required().min(2).max(600),
                description: Joi.string().optional().min(2).max(600),
                sort_order: Joi.number().required()
            }])
        }])
    }
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

var categoryManageUpdate = {
    c_id: Joi.number().required(),
    c_groups: Joi.array().items(Joi.number().required())
};

var productGet = {
    p_id: Joi.number().required()
};

var invoiceCreate = {
    user_id: Joi.number().required(),
    provider: Joi.number().required(),
    invoice_number: Joi.number().required(),
    invoice_cost: Joi.number().required(),
    products: Joi.array().items([{
        pt_id: Joi.number().required(),
        pt_count: Joi.number().required(),
        pt_price: Joi.number().required()
    }])
};

module.exports = {
    productGroupsParams: productGroupsParams,
    productCategoryParams: productCategoryParams,
    productGroupCreateBody: productGroupCreateBody,
    productSubGroupCreateBody: productSubGroupCreateBody,
    productSubGroupUpdateBody: productSubGroupUpdateBody,
	productCreateSchema: productCreateSchema,
    characteristicGroupCreate: characteristicGroupCreate,
    characteristicGroupUpdate: characteristicGroupUpdate,
    categoryCreate: categoryCreate,
    categoryUpdate: categoryUpdate,
    categoryManageUpdate: categoryManageUpdate,
    productGet: productGet,
    invoiceCreate: invoiceCreate
};
