const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const dbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    throw new Error('Error connecting to the database: ' + error.message);
  }
};

module.exports = dbConnection;