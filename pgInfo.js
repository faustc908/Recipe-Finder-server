/* connecting to database*/

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Puddle908",
  host: "localhost",
  port: 5432,
  database: "recipe",
});

module.exports = pool;
