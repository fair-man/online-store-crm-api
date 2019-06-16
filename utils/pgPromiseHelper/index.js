var pgp = require('pg-promise');

var pgPromiseHelper = {
    filterSet: function (filters) {
        console.log('QUERY PARAMS =>', filters);
        if (!filters || typeof filters !== 'object') {
            throw new TypeError('Parameter \'filters\' must be an object.');
        }

        var keys = Object.keys(filters);
        var s = keys.map(function (k) {
            return pgp.as.name(k) + ' = ${' + k + '}';
        }).join(' AND ');
        return pgp.as.format(s, filters);
    }
};

module.exports = pgPromiseHelper;