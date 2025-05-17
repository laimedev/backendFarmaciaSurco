const mysql = require('mysql2');

const connection = mysql.createPool({
  host: '193.203.166.206',
  user: 'u744697357_farmaciaSurco',
  password: 'farmaciaSurco123',
  database: 'u744697357_farmaciaSurco',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = connection;
