var nconf = require('nconf');
var path = require('path');

nconf.argv()
  .env()
  .file({ file: path.join(__dirname, 'config.json' )});

nconf.set('postgresql:uri', process.env.DATABASE_URL);
nconf.set('mailer:e-mail', process.env.EMAIL);
nconf.set('mailer:secure', process.env.SECURE);
nconf.set('mailer:auth:user', process.env.EMAIL_USER);
nconf.set('mailer:auth:pass', process.env.EMAIL_PASS);
nconf.set('mailer:host', process.env.EMAIL_HOST);
nconf.set('mailer:port', process.env.EMAIL_HOST_PORT);
nconf.set('mailer:secure', process.env.SECURE);
nconf.set('session:secret', process.env.SESSION_SECRET_KEY);
nconf.set('session:cookie:maxAge', new Date( Date.now() + 60 * 60 * 1000 ));
nconf.set('cloudinary:cloudinary_name', process.env.CLOUDINARY_NAME);
nconf.set('cloudinary:cloudinary_api_key', process.env.CLOUDINARY_API_KEY);
nconf.set('cloudinary:cloudinary_api_secret', process.env.CLOUDINARY_API_SECRET);

module.exports = nconf;
