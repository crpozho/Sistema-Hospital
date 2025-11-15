// backend/database.js
const sql = require('mssql');

let pool = null;

async function getPool() {
  if (pool) return pool;

  const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === 'true',
      trustServerCertificate:
        String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase() === 'true',
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  };

  pool = await sql.connect(config);
  return pool;
}

module.exports = { getPool, sql };
