const mysql = require("mysql2/promise");
const {
  DB_PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require("../config.json");

// const {
//   MYSQL_HOST,
//   MYSQL_USER,
//   MYSQL_PW,
//   MYSQL_DB,
// } = ;

const connection = mysql.createPool({
  port: DB_PORT,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectTimeout: 5000,
  connectionLimit: 30, //default 10
  keepAliveInitialDelay: 10000,
  enableKeepAlive: true,
});

module.exports = connection;
