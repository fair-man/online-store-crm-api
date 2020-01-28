var express = require('express');
var router = express.Router();
var db = require('../../libs/db-connect');
var moment = require('moment');

var responseFormatter = require('../../utils/responseFormatter');
var requestValidator = require('../../utils/requestValidator');
var providerSchemas = require('./providerSchema');
var Enums = require('../../config/enums/index');

router.post('/',
        requestValidator.body(providerSchemas.providerCreateSchema),
        function (req, res, next) {
        var provider_json = req.body.provider_json;
        provider_json.provider_data.created_date = moment().format('YYYY-MM-DD HH:mm:ss');
        db.any('SELECT * from public.provider_create(${provider_json})', {provider_json: JSON.stringify(provider_json)})
            .then(function (response) {
                var opts = {data: response[0], rc: 0};

                responseFormatter(Enums.codes.SUCCESS, opts, req, res);
            }).catch(function (error) {
            var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

            responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
        });
    });

router.put('/:p_id',
    requestValidator.params(providerSchemas.providerParamsSchema),
    requestValidator.body(providerSchemas.providerUpdateSchema),
    function (req, res, next) {
        var p_id = req.body.provider_json.provider_data.id;
        var provider_json = req.body.provider_json;

        db.any('SELECT * from public.provider_update(${p_id}, ${provider_json})',
            {p_id: p_id, provider_json: JSON.stringify(provider_json)})
            .then(function (response) {
                var opts = {data: response[0], rc: 0};

                responseFormatter(Enums.codes.SUCCESS, opts, req, res);
            }).catch(function (error) {
            var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

            responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
        });
    });

router.get('/names', function (req, res, next) {
    db.any('SELECT * from public.providers_names_get()')
        .then(function (response) {
            var opts = {data: {providers: response}, rc: 0};

            responseFormatter(Enums.codes.SUCCESS, opts, req, res);
        }).catch(function (error) {
        var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

        responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
    });
});

router.get('/', function (req, res, next) {
    db.any('SELECT * FROM providers WHERE name ILIKE \'%$1#%\' LIMIT 25', req.query.name)
        .then(function (response) {
            var opts = {data: {providers: response}, rc: 0};

            responseFormatter(Enums.codes.SUCCESS, opts, req, res);
        }).catch(function (error) {
        var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

        responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
    });
});

router.get('/:p_id', function (req, res, next) {
    var p_id = req.params.p_id;

    db.any('SELECT * from public.provider_get(${p_id})', {p_id: p_id})
        .then(function (response) {
            var opts = {data: response[0].provider_data, rc: 0};

            responseFormatter(Enums.codes.SUCCESS, opts, req, res);
        }).catch(function (error) {
        var opts = {error: error, rc: Enums.codes.BACKEND_ERROR};

        responseFormatter(Enums.codes.BACKEND_ERROR, opts, req, res);
    });
});

module.exports = router;
