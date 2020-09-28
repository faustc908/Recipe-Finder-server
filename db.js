// Database set up

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Puddle908",
  host: "localhost",
  PORT: 5432 || 8000,
  database: "recipe",
});

module.exports = pool;
