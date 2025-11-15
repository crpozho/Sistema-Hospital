require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  }
};

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

async function getPool() {
  await poolConnect; // espera a que la conexión se establezca
  return pool;
}

module.exports = {
  sql,
  getPool
};
