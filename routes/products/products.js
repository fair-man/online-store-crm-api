var express = require('express');
var router = express.Router();
var db = require('../../libs/db-connect');
var productSchemas = require('./productsSchema');

var responseFormatter = require('../../utils/responseFormatter');
var requestValidator = require('../../utils/requestValidator');

router.post('/',
	requestValidator.body(productSchemas.productCreateSchema),
	function (req, res, next) {
		var product_json = {
			category_product_id: 1,
			name: 'Мобильный тебефон MyPhone2',
			description: 'Мобильный телефон с самой новой ОС и передовыми технологиями',
			vendor_code: '1111000000001',
			price: 100,
			count: 99,
			products_groups_description_options: [
				{
					name: 'Основные характеристики',
					is_main: 1,
					options: [
						{
							name: 'Характеристика 1',
							value: 'Значение характеристики 1',
							description: 'Доп. описание характеристики'
						},
						{
							name: 'Характеристика 2',
							value: 'Значение характеристики 2',
							description: 'Доп. описание характеристики'
						}
					]
				},
				{
					name: 'Камера',
					is_main: 0,
					options: [
						{
							name: 'Передняя',
							value: '1,3 мегапикселя',
							description: null
						},
						{
							name: 'Задняя',
							value: '8 мегапикселей',
							description: null
						}
					]
				}
			]
		};

		db.any('SELECT * from public.product_create(${product_json})', {product_json: JSON.stringify(product_json)})
			.then(function (response) {
				responseFormatter(200, {data: 'Ok', rc: 0}, req, res);
			}).catch(function (error) {
				responseFormatter(500, {error: error, rc: 500}, req, res);
		});
	});


router.get('/groups_categories', function (req, res, next) {
	db.any('SELECT * from public.groups_categories_products')
		.then(function (response) {
			responseFormatter(200, {data: {groups_categories: response}, rc: 0}, req, res);
		}).catch(function (error) {
			responseFormatter(500, {error: error, rc: 500}, req, res);
    });
});

router.get('/groups_subcategories',
	requestValidator.query(productSchemas.productGroupsParams),
	function (req, res, next) {
	var select = 'SELECT * from public.groups_subcategories_products';

	if (req.query.g_id) {
		select += ' WHERE groups_subcategories_products.id = ' + req.query.g_id;
	}

    db.any(select)
        .then(function (response) {
            responseFormatter(200, {data: {groups_subcategories: response}, rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(500, {error: error, rc: 500}, req, res);
    });
});

router.get('/categories', function (req, res, next) {
    db.any('SELECT * from public.groups_subcategories_products')
        .then(function (response) {
            responseFormatter(200, {data: {categories: response}, rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(500, {error: error, rc: 500}, req, res);
    });
});

module.exports = router;