var express = require('express');
var router = express.Router();
var db = require('../../libs/db-connect');
var moment = require('moment');

var responseFormatter = require('../../utils/responseFormatter');
var requestValidator = require('../../utils/requestValidator');
var providerSchemas = require('./providerSchema');

router.post('/',
    requestValidator.body(providerSchemas.providerCreateSchema),
        function (req, res, next) {
        var provider_json = req.body.provider_json;
        provider_json.provider_data.created_date = moment().format('YYYY-MM-DD HH:mm:ss');
        db.any('SELECT * from public.provider_create(${provider_json})', {provider_json: JSON.stringify(provider_json)})
            .then(function (response) {
                var opts = {data: {provider: response[0]}, rc: 0};

                responseFormatter(200, opts, req, res);
            }).catch(function (error) {
            var opts = {error: error, rc: 500};

            responseFormatter(500, opts, req, res);
        });
    });

router.put('/',
    requestValidator.params(providerSchemas.providerParamsSchema),
    requestValidator.body(providerSchemas.providerUpdateSchema),
    function (req, res, next) {
        var p_id = req.body.provider_json.provider_data.id;
        var provider_json = req.body.provider_json;

        db.any('SELECT * from public.provider_update(${p_id}, ${provider_json})',
            {p_id: p_id, provider_json: JSON.stringify(provider_json)})
            .then(function (response) {
                var opts = {data: {provider: response[0]}, rc: 0};

                responseFormatter(200, opts, req, res);
            }).catch(function (error) {
            var opts = {error: error, rc: 500};

            responseFormatter(500, opts, req, res);
        });
    });

module.exports = router;