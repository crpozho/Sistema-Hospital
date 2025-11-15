// backend/models/usuarioModel.js

const { getPool } = require('../config/db');

// Obtener todos los usuarios
async function obtenerUsuarios() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT
      idUsuario,
      nombre,
      usuario,
      rol,
      estado
    FROM Usuarios
  `);

  return result.recordset;
}

// Crear un usuario
async function crearUsuario(data) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('nombre', data.nombre)
    .input('usuario', data.usuario)
    .input('password', data.password)
    .input('rol', data.rol)
    .input('estado', data.estado)
    .query(`
      INSERT INTO Usuarios (nombre, usuario, password, rol, estado)
      VALUES (@nombre, @usuario, @password, @rol, @estado)
    `);

  return result.rowsAffected;
}

// 🔹 Autenticar usuario por usuario + password
async function autenticarUsuario({ usuario, password }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('usuario', usuario)
    .input('password', password)
    .query(`
      SELECT
        idUsuario,
        nombre,
        usuario,
        rol,
        estado
      FROM Usuarios
      WHERE usuario = @usuario
        AND password = @password
        AND estado = 1
    `);

  // Si no encuentra, devolverá undefined
  return result.recordset[0];
}

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  autenticarUsuario
};
