// backend/controllers/pacienteController.js

const { getPool } = require('../config/db');

// GET /pacientes
async function listarPacientes(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        idPaciente,
        nombre,
        apellido,
        dni,
        fechaNacimiento,
        telefono,
        correo,
        direccion,
        seguro,
        estado
      FROM Pacientes
      WHERE estado = 1
    `);

    return res.json({
      status: 'OK',
      pacientes: result.recordset.map(r => ({
        idPaciente: r.idPaciente,
        nombre: r.nombre,
        apellido: r.apellido,
        dni: r.dni,
        fechaNacimiento: r.fechaNacimiento,
        telefono: r.telefono,
        correo: r.correo,
        direccion: r.direccion,
        seguro: r.seguro,
        estado: !!r.estado,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error listando pacientes',
      details: error.message,
    });
  }
}

// POST /pacientes
async function crearPaciente(req, res) {
  try {
    const {
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      telefono,
      correo,
      direccion,
      seguro,
      estado = 1,
    } = req.body;

    const pool = await getPool();
    await pool
      .request()
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('dni', dni)
      .input('fechaNacimiento', fechaNacimiento)
      .input('telefono', telefono)
      .input('correo', correo)
      .input('direccion', direccion)
      .input('seguro', seguro)
      .input('estado', estado)
      .query(`
        INSERT INTO Pacientes
        (nombre, apellido, dni, fechaNacimiento, telefono, correo, direccion, seguro, estado)
        VALUES
        (@nombre, @apellido, @dni, @fechaNacimiento, @telefono, @correo, @direccion, @seguro, @estado)
      `);

    return res.status(201).json({
      status: 'OK',
      message: 'Paciente creado correctamente',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error creando paciente',
      details: error.message,
    });
  }
}

// PUT /pacientes/:id
async function actualizarPaciente(req, res) {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      telefono,
      correo,
      direccion,
      seguro,
      estado = 1,
    } = req.body;

    const pool = await getPool();
    const result = await pool
      .request()
      .input('idPaciente', id)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('dni', dni)
      .input('fechaNacimiento', fechaNacimiento)
      .input('telefono', telefono)
      .input('correo', correo)
      .input('direccion', direccion)
      .input('seguro', seguro)
      .input('estado', estado)
      .query(`
        UPDATE Pacientes
        SET nombre=@nombre,
            apellido=@apellido,
            dni=@dni,
            fechaNacimiento=@fechaNacimiento,
            telefono=@telefono,
            correo=@correo,
            direccion=@direccion,
            seguro=@seguro,
            estado=@estado
        WHERE idPaciente=@idPaciente
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Paciente no encontrado',
      });
    }

    return res.json({
      status: 'OK',
      message: 'Paciente actualizado correctamente',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error actualizando paciente',
      details: error.message,
    });
  }
}

// DELETE /pacientes/:id
async function eliminarPaciente(req, res) {
  try {
    const { id } = req.params;

    const pool = await getPool();
    const result = await pool
      .request()
      .input('idPaciente', id)
      .query(`
        DELETE FROM Pacientes
        WHERE idPaciente = @idPaciente
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Paciente no encontrado',
      });
    }

    return res.json({
      status: 'OK',
      message: 'Paciente eliminado correctamente',
    });
  } catch (error) {
    // Si hay FK con citas, dará error de constraint
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error eliminando paciente',
      details: error.message,
    });
  }
}

module.exports = {
  listarPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
