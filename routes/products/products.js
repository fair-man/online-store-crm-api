var express = require('express');
var router = express.Router();
var db = require('../../libs/db-connect');
var productSchemas = require('./productsSchema');
var moment = require('moment');
var async = require("async");

var cloudinary = require('../../libs/cloudinary-file-upload');
var responseFormatter = require('../../utils/responseFormatter');
var requestValidator = require('../../utils/requestValidator');
var Enums = require('../../config/enums/index');

router.get('/groups_categories', function (req, res, next) {
    db.any('SELECT * from public.groups_categories_products')
        .then(function (response) {
            responseFormatter(Enums.codes.SUCCESS, {data: response, rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
    });
});

router.post('/groups_categories/create',
    requestValidator.body(productSchemas.productGroupCreateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_category_create(${g_name}, ${g_description})', req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    }
);

router.put('/groups_categories/update',
    requestValidator.body(productSchemas.productGroupCreateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_category_update(${g_id}, ${g_name}, ${g_description})', req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
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
                responseFormatter(Enums.codes.SUCCESS, {data: response, rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.post('/groups_subcategories/create',
    requestValidator.body(productSchemas.productSubGroupCreateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_subcategory_create(${gs_group_category_id}, ${gs_name}, ${gs_description})',
            req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.put('/groups_subcategories/update',
    requestValidator.body(productSchemas.productSubGroupUpdateBody),
    function (req, res, next) {
        db.any('SELECT * from public.group_subcategory_update(${gs_id}, ${gs_group_category_id}, ${gs_name},' +
            ' ${gs_description})', req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
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
                responseFormatter(Enums.codes.SUCCESS, {data: response, rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.get('/categories/groups',
    requestValidator.query(productSchemas.productCategoryParams),
    function (req, res, next) {
        db.any('SELECT * from public.category_groups_get(${c_id})', req.query)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response, rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.get('/categories/manage', function (req, res, next) {
    db.any('SElECT * from public.category_get()')
        .then(function (response) {
            responseFormatter(Enums.codes.SUCCESS, {data: response, rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
    });
});

router.post('/categories/create',
    requestValidator.body(productSchemas.categoryCreate),
    function (req, res, next) {
        db.any('SELECT * from public.category_create(${c_group_subcategory_id}, ${c_name}, ${c_description})',
            req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.put('/categories/update',
    requestValidator.body(productSchemas.categoryUpdate),
    function (req, res, next) {
        db.any('SELECT * from public.category_update(${c_id}, ${c_group_subcategory_id}, ${c_name}, ${c_description})',
            req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.put('/categories/manage/update',
    requestValidator.body(productSchemas.categoryManageUpdate),
    function (req, res, next) {
    db.any('SElECT * from public.category_groups_characteristics_update(${c_id}, ${c_groups})', req.body)
        .then(function (response) {
            responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
    });
});

router.get('/groups/characteristics', function (req, res, next) {
    db.any('SELECT * from public.characteristic_groups_products')
        .then(function (response) {
            responseFormatter(Enums.codes.SUCCESS, {data: response, rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
    });
});

router.post('/groups/characteristics/create',
    requestValidator.body(productSchemas.characteristicGroupCreate),
    function (req, res, next) {
        db.any('SELECT * from public.group_characteristic_create(' +
            '${ch_name}, ${ch_description}, ${ch_is_main}, ${ch_sort_order})',
            req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.put('/groups/characteristics/update',
    requestValidator.body(productSchemas.characteristicGroupUpdate),
    function (req, res, next) {
        db.any('SELECT * from public.group_characteristic_update(' +
            '${ch_id}, ${ch_name}, ${ch_description}, ${ch_is_main}, ${ch_sort_order})',
            req.body)
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: response[0], rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.post('/create',
    requestValidator.body(productSchemas.productCreateSchema),
    function (req, res, next) {
        req.body.product_json.created_date = moment().format('YYYY-MM-DD HH:mm:ss');
        db.any('SELECT * from public.product_create(${product_json})', {product_json: JSON.stringify(req.body.product_json)})
            .then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: 'Ok', rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.post('/update/:p_id',
    requestValidator.body(productSchemas.productCreateSchema),
    function (req, res, next) {
        db.any('SELECT * from public.product_update(${pt_id}, ${product_json})', {
            pt_id: req.params.p_id,
            product_json: JSON.stringify(req.body.product_json)
        }).then(function (response) {
                responseFormatter(Enums.codes.SUCCESS, {data: 'Ok', rc: 0}, req, res);
            }).catch(function (error) {
            responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
        });
    });

router.post('/:p_id/images/add', function (req, res, next) {
    if (req.files && req.files.files && req.params.p_id) {
        var p_id = req.params.p_id;
        var mainFile = req.files.files.forEach ? req.files.files[0] : req.files.files;
        var otherFiles = req.files.files.forEach && req.files.files.length > 1 ? req.files.files.slice(1) : [];
        var arrImages = [
            uploadImage.bind(this, mainFile, 1)
        ];

        otherFiles.forEach(function (item) {
            arrImages.push(uploadImage.bind(this, item, 0));
        });

        async.series(arrImages, function (err, results) {
            if (err) {
                responseFormatter(Enums.codes.BACKEND_ERROR,
                    {error: err, rc: Enums.codes.BACKEND_ERROR}, req, res);
            } else {
                var images = results.map(function (file, index) {
                    return {
                        is_main: +(index === 0),
                        image_src: file.secure_url
                    }
                });

                db.any('SELECT * from public.product_images_add(${pt_id}, ${images})', {
                    pt_id: p_id,
                    images: JSON.stringify(images)
                }).then(function (response) {
                    responseFormatter(Enums.codes.SUCCESS, {data: 'Ok', rc: 0}, req, res);
                }).catch(function (error) {
                    responseFormatter(Enums.codes.BACKEND_ERROR,
                        {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
                })
            }
        })
    }

    function uploadImage(file, isMain, callback) {
        var name = 'product_' + p_id + '.' + file.name.split('.')[1];

        file.mv('./' + name, function(error) {
            if (error) {
                console.log(error);
            } else {
                cloudinary.uploader.upload('./' + name, {
                    resource_type: "auto",
                    folder: "online-store/products/" + p_id + '/',
                    public_id: 'product_' + p_id + '_' + file.name.split('.')[0]
                }, function (error, result) {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, result);
                    }
                });
            }
        })
    }
});

router.get('/search', function (req, res, next) {
    db.any('SELECT * from public.products_search(${p_name}, ${p_code})',
        {p_name: req.query.p_name || null, p_code: req.query.p_code || null})
        .then(function (response) {
            responseFormatter(Enums.codes.SUCCESS, {data: response, rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
    });
});

router.get('/:p_id', function (req, res, next) {
    requestValidator.params(productSchemas.productGet),
    db.any('SELECT * from public.product_get(${p_id})', {p_id: req.params.p_id})
        .then(function (response) {
            responseFormatter(Enums.codes.SUCCESS, {data: response && response[0], rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
    });
});

router.post('/invoice/create',
    requestValidator.body(productSchemas.invoiceCreate),
    function (req, res, next) {
    var invoice_json = req.body;
    invoice_json.created_date = moment().format('YYYY-MM-DD HH:mm:ss');
    db.any('SELECT * from public.invoice_create(${invoice_json})', {invoice_json: JSON.stringify(invoice_json)})
        .then(function (response) {
            responseFormatter(Enums.codes.SUCCESS, {data: 'Ok', rc: 0}, req, res);
        }).catch(function (error) {
        responseFormatter(Enums.codes.BACKEND_ERROR, {error: error, rc: Enums.codes.BACKEND_ERROR}, req, res);
    });
});

module.exports = router;
