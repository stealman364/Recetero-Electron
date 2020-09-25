const mysql = require("promise-mysql");

const connection = mysql.createConnection({
  host: "xxxxxxxxxx.com",
  user: "xxxxxxx",
  password: "xxxxxxxxxxxxx",
  port: "3306",
  database: "xxxxxxxxxxxxx",
});

function getConexion() {
  return connection;
}

function closeConection(connection) {
  connection.release();
}

module.exports = { getConexion, closeConection };
