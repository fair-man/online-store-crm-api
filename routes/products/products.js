var express = require('express');
var router = express.Router();
var db = require('../../libs/db-connect');
var productSchemas = require('./productsSchema');

var responseFormatter = require('../../utils/responseFormatter');
var requestValidator = require('../../utils/requestValidator');

router.get('/groups_categories', function (req, res, next) {
    db.any('SELECT * from public.groups_categories_products')
        .then(function (response) {
            responseFormatter(200, {data: {groups_categories: response}, rc: 0}, req, res);
        }).catch(function (error) {
			responseFormatter(500, {error: error, rc: 500}, req, res);
		});
});

router.post('/groups_categories/create',
    requestValidator.body(productSchemas.productGroupCreateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_category_create(${name}, ${description})',
            {name: req.body.name, description: req.body.description})
            .then(function (response) {
                responseFormatter(200, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
				responseFormatter(500, {error: error, rc: 500}, req, res);
			});
    }
);

router.put('/groups_categories/update',
    requestValidator.body(productSchemas.productGroupCreateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_category_update(${id}, ${name}, ${description})',
            {id: req.body.id, name: req.body.name, description: req.body.description})
            .then(function (response) {
                responseFormatter(200, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
				responseFormatter(500, {error: error, rc: 500}, req, res);
			});
    }
);

router.get('/groups_subcategories',
	requestValidator.query(productSchemas.productGroupsParams),
	function (req, res, next) {
	var select = 'SELECT * from public.groups_subcategories_products';

	if (req.query.g_id) {
		select += ' WHERE groups_subcategories_products.group_category_id = ' + req.query.g_id;
	}

    db.any(select)
        .then(function (response) {
            responseFormatter(200, {data: {groups_subcategories: response}, rc: 0}, req, res);
        }).catch(function (error) {
			responseFormatter(500, {error: error, rc: 500}, req, res);
		});
});

router.post('/groups_subcategories/create', function (req, res, next) {
	db.any('SELECT * from public.group_subcategory_create(${id}, ${name}, ${description})', {
		id: req.body.g_group_category_id, name: req.body.g_name, description: req.body.g_description
	}).then(function (response) {
        responseFormatter(200, {data: response[0], rc: 0}, req, res);
	}).catch(function (error) {
        responseFormatter(500, {error: error, rc: 500}, req, res);
    });
});

router.put('/groups_subcategories/update', function (req, res, next) {
    db.any('SELECT * from public.group_subcategory_update(${g_id}, ${g_group_category_id}, ${g_name}, ${g_description})', {
        g_id: req.body.g_id,
        g_group_category_id: req.body.g_group_category_id,
        g_name: req.body.g_name,
        g_description: req.body.g_description
    }).then(function (response) {
        responseFormatter(200, {data: response[0], rc: 0}, req, res);
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

module.exports = router;