
var db = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'payments',
    password: 'appassword',
    database: 'payments'
  },
  pool: { min: 0, max: 7 }
});

module.exports = db;
