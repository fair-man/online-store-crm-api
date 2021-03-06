var Enums = require('../../config/enums');

function responseFormatter(status, opts, req, res) {
  var response_status = {rc_id: opts.rc, rc_message: Enums.rcs[opts.rc]};

  if (status >= 200 && status < 300) {
    response_status.rc = res.status(status).type('application/json').send(JSON.stringify({
      data: opts.data, response_status: response_status
    }));
  } else {
      res.status(status).type('application/json').send(JSON.stringify({
          error: opts.error, response_status: response_status
      }));
  }
}

module.exports = responseFormatter;