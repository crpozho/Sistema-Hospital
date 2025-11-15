// backend/controllers/citaController.js
const {
  listarCitas,
  crearCita,
  actualizarCita,
  eliminarCita,
} = require('../models/citaModel');

/**
 * GET /citas
 * Roles permitidos: ADMIN, RECEPCION, MEDICO (cualquier autenticado)
 */
async function getCitas(req, res) {
  try {
    const citas = await listarCitas();
    return res.json({ status: 'OK', citas });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'No se pudieron listar las citas',
      details: error.message,
    });
  }
}

/**
 * POST /citas
 * Roles permitidos: ADMIN, RECEPCION
 * Body requerido: { idPaciente, idMedico, fechaHora, motivo?, estado? }
 *   - fechaHora: ISO string o 'YYYY-MM-DD HH:mm:ss'
 */
async function postCita(req, res) {
  const { idPaciente, idMedico, fechaHora, motivo, estado } = req.body;

  if (!idPaciente || !idMedico || !fechaHora) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'idPaciente, idMedico y fechaHora son obligatorios',
    });
  }

  try {
    const { idCita } = await crearCita({
      idPaciente,
      idMedico,
      fechaHora,
      motivo,
      estado,
    });

    return res.status(201).json({
      status: 'OK',
      message: 'Cita creada',
      idCita,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'No se pudo crear la cita',
      details: error.message,
    });
  }
}

/**
 * PUT /citas/:id
 * Roles permitidos: ADMIN, MEDICO
 * Body: { idPaciente, idMedico, fechaHora, motivo, estado }
 */
async function putCita(req, res) {
  const { id } = req.params;
  const { idPaciente, idMedico, fechaHora, motivo, estado } = req.body;

  if (!idPaciente || !idMedico || !fechaHora || !estado) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'idPaciente, idMedico, fechaHora y estado son obligatorios',
    });
  }

  try {
    const { updated } = await actualizarCita(id, {
      idPaciente,
      idMedico,
      fechaHora,
      motivo,
      estado,
    });

    if (!updated) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Cita no encontrada o sin cambios',
      });
    }

    return res.json({ status: 'OK', message: 'Cita actualizada' });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'No se pudo actualizar la cita',
      details: error.message,
    });
  }
}

/**
 * DELETE /citas/:id
 * Rol permitido: ADMIN
 */
async function deleteCita(req, res) {
  const { id } = req.params;

  try {
    const { deleted } = await eliminarCita(id);

    if (!deleted) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Cita no encontrada',
      });
    }

    return res.json({ status: 'OK', message: 'Cita eliminada' });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'No se pudo eliminar la cita',
      details: error.message,
    });
  }
}

module.exports = {
  getCitas,
  postCita,
  putCita,
  deleteCita,
};
