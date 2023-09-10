const mysql = require('mysql2/promise')


// const {
//   MYSQL_HOST,
//   MYSQL_USER,
//   MYSQL_PW,
//   MYSQL_DB,
// } = process.env;

const connection = mysql.createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 5000,
  connectionLimit: 30, //default 10
  keepAliveInitialDelay: 10000,
  enableKeepAlive: true,
})


module.exports = connection;