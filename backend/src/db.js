const { Pool } = require("pg");
const { config } = require("./config");

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl
    ? { rejectUnauthorized: config.databaseSslRejectUnauthorized }
    : false
});

async function query(text, params = []) {
  return pool.query(text, params);
}

module.exports = { pool, query };
