var express = require('express');
var router = express.Router();
var db = require('../../libs/db-connect');
var productSchemas = require('./productsSchema');

var responseFormatter = require('../../utils/responseFormatter');
var requestValidator = require('../../utils/requestValidator');

router.get('/groups_categories', function (req, res, next) {
    db.any('SELECT * from public.groups_categories_products')
        .then(function (response) {
            responseFormatter(200, {data: response, rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(500, {error: error, rc: 500}, req, res);
    });
});

router.post('/groups_categories/create',
    requestValidator.body(productSchemas.productGroupCreateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_category_create(${g_name}, ${g_description})', req.body)
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
        db.any('SELECT * from public.group_category_update(${g_id}, ${g_name}, ${g_description})', req.body)
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
                responseFormatter(200, {data: response, rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(500, {error: error, rc: 500}, req, res);
        });
    });

router.post('/groups_subcategories/create',
    requestValidator.body(productSchemas.productSubGroupCreateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_subcategory_create(${gs_group_category_id}, ${gs_name}, ${gs_description})',
            req.body)
        .then(function (response) {
            responseFormatter(200, {data: response[0], rc: 0}, req, res);
        }).catch(function (error) {
            responseFormatter(500, {error: error, rc: 500}, req, res);
        });
    });

router.put('/groups_subcategories/update',
    requestValidator.body(productSchemas.productSubGroupUpdateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_subcategory_update(${gs_id}, ${gs_group_category_id}, ${gs_name},' +
            ' ${gs_description})', req.body)
        .then(function (response) {
            responseFormatter(200, {data: response[0], rc: 0}, req, res);
        }).catch(function (error) {
            responseFormatter(500, {error: error, rc: 500}, req, res);
        });
    });

router.get('/categories',
    requestValidator.query(productSchemas.productGroupsParams),
    function (req, res, next) {
        var select = 'SELECT * from public.categories_products';

        if (req.query.g_id) {
            select += ' WHERE categories_products.group_subcategory_id = ' + req.query.g_id;
        }

        db.any(select)
            .then(function (response) {
                responseFormatter(200, {data: response, rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(500, {error: error, rc: 500}, req, res);
        });
    });

router.post('/categories/create',
    requestValidator.body(productSchemas.categoryCreate),
    function (req, res, next) {
        db.any('SELECT * from public.category_create(${c_group_subcategory_id}, ${c_name}, ${c_description})',
            req.body)
            .then(function (response) {
                responseFormatter(200, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(500, {error: error, rc: 500}, req, res);
        });
    });

router.put('/categories/update',
    requestValidator.body(productSchemas.categoryUpdate),
    function (req, res, next) {
        db.any('SELECT * from public.category_update(${c_id}, ${c_group_subcategory_id}, ${c_name}, ${c_description})',
            req.body)
            .then(function (response) {
                responseFormatter(200, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(500, {error: error, rc: 500}, req, res);
        });
    });

router.post('/characteristics/create',
    requestValidator.body(productSchemas.characteristicGroupCreate),
    function (req, res, next) {
        db.any('SELECT * from public.characteristic_group_create(${ch_name}, ${ch_description}, ${ch_is_main})',
            req.body)
            .then(function (response) {
                responseFormatter(200, {data: response[0], rc: 0}, req, res);
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