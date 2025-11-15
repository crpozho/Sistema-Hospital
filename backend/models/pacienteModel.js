// backend/models/pacienteModel.js
const { getPool } = require('../config/db');

// LISTAR (solo activos)
async function obtenerPacientes() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT
      idPaciente,
      nombre,
      apellido,
      dni,
      CONVERT(varchar(10), fechaNacimiento, 23) AS fechaNacimiento,
      telefono,
      correo,
      direccion,
      seguro,
      estado
    FROM Pacientes
    WHERE estado = 1
    ORDER BY idPaciente
  `);
  return result.recordset;
}

// OBTENER POR ID (si lo necesitas)
async function obtenerPacientePorId(idPaciente) {
  const pool = await getPool();
  const result = await pool.request()
    .input('idPaciente', idPaciente)
    .query(`
      SELECT
        idPaciente,
        nombre,
        apellido,
        dni,
        CONVERT(varchar(10), fechaNacimiento, 23) AS fechaNacimiento,
        telefono,
        correo,
        direccion,
        seguro,
        estado
      FROM Pacientes
      WHERE idPaciente = @idPaciente
    `);
  return result.recordset[0];
}

// CREAR
async function crearPaciente(data) {
  const pool = await getPool();
  const result = await pool.request()
    .input('nombre', data.nombre)
    .input('apellido', data.apellido)
    .input('dni', data.dni)
    .input('fechaNacimiento', data.fechaNacimiento)
    .input('telefono', data.telefono)
    .input('correo', data.correo)
    .input('direccion', data.direccion)
    .input('seguro', data.seguro)
    .input('estado', data.estado ?? 1)
    .query(`
      INSERT INTO Pacientes (nombre, apellido, dni, fechaNacimiento, telefono, correo, direccion, seguro, estado)
      VALUES (@nombre, @apellido, @dni, @fechaNacimiento, @telefono, @correo, @direccion, @seguro, @estado)
    `);
  return result.rowsAffected[0]; // 1 si insertó
}

// ACTUALIZAR
async function actualizarPaciente(idPaciente, data) {
  const pool = await getPool();
  const result = await pool.request()
    .input('idPaciente', idPaciente)
    .input('nombre', data.nombre)
    .input('apellido', data.apellido)
    .input('dni', data.dni)
    .input('fechaNacimiento', data.fechaNacimiento)
    .input('telefono', data.telefono)
    .input('correo', data.correo)
    .input('direccion', data.direccion)
    .input('seguro', data.seguro)
    .query(`
      UPDATE Pacientes
      SET
        nombre = @nombre,
        apellido = @apellido,
        dni = @dni,
        fechaNacimiento = @fechaNacimiento,
        telefono = @telefono,
        correo = @correo,
        direccion = @direccion,
        seguro = @seguro
      WHERE idPaciente = @idPaciente
    `);
  return result.rowsAffected[0]; // 1 si actualizó
}

// ELIMINAR LÓGICO (estado = 0)
async function eliminarPacienteLogico(idPaciente) {
  const pool = await getPool();
  const result = await pool.request()
    .input('idPaciente', idPaciente)
    .query(`
      UPDATE Pacientes
      SET estado = 0
      WHERE idPaciente = @idPaciente
    `);
  return result.rowsAffected[0]; // 1 si actualizó
}

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  eliminarPacienteLogico,
};
