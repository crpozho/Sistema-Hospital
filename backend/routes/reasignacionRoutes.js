const express = require("express");
const router = express.Router();
const sql = require("mssql");
const { getPool } = require("../database");

/* ----------------------------------------------------
   POST /api/citas/:id/reasignar
---------------------------------------------------- */
router.post("/citas/:id/reasignar", async (req, res) => {
  const pool = await getPool();
  const idCita = req.params.id;
  const { idMedicoNuevo, motivo, idUsuario } = req.body;

  if (!idMedicoNuevo || !motivo || !idUsuario) {
    return res.status(400).json({
      status: "ERROR",
      message: "Faltan datos obligatorios (nuevo médico, motivo, usuario)",
    });
  }

  try {
    const citaQuery = await pool
      .request()
      .input("idCita", sql.Int, idCita)
      .query("SELECT idMedico FROM Citas WHERE idCita = @idCita");

    if (citaQuery.recordset.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        message: "Cita no encontrada",
      });
    }

    const idMedicoAnterior = citaQuery.recordset[0].idMedico;

    // Registrar la reasignación
    await pool
      .request()
      .input("idCita", sql.Int, idCita)
      .input("idMedicoAnterior", sql.Int, idMedicoAnterior)
      .input("idMedicoNuevo", sql.Int, idMedicoNuevo)
      .input("motivo", sql.NVarChar, motivo)
      .input("idUsuario", sql.Int, idUsuario)
      .query(`
        INSERT INTO Reasignaciones 
        (idCita, idEspecialidadAnterior, idEspecialidadNueva, motivo, idUsuario)
        VALUES (@idCita, @idMedicoAnterior, @idMedicoNuevo, @motivo, @idUsuario)
      `);

    // Actualizar la cita
    await pool
      .request()
      .input("idCita", sql.Int, idCita)
      .input("idMedicoNuevo", sql.Int, idMedicoNuevo)
      .query("UPDATE Citas SET idMedico = @idMedicoNuevo WHERE idCita = @idCita");

    res.json({
      status: "OK",
      message: "Reasignación completada correctamente",
      data: { idCita, idMedicoAnterior, idMedicoNuevo },
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: "Error interno al reasignar turno",
      details: err.message,
    });
  }
});

/* ----------------------------------------------------
   GET /api/reasignaciones
---------------------------------------------------- */
router.get("/reasignaciones", async (req, res) => {
  const pool = await getPool();
  try {
    const result = await pool.request().query(`
      SELECT 
        R.idReasignacion,
        R.idCita,
        C.fechaHora,
        MA.nombre AS medicoAnterior,
        MN.nombre AS medicoNuevo,
        R.motivo,
        U.nombre AS usuarioResponsable,
        R.fechaHora AS fechaCambio
      FROM Reasignaciones R
      INNER JOIN Citas C ON R.idCita = C.idCita
      INNER JOIN Medicos MA ON R.idEspecialidadAnterior = MA.idMedico
      INNER JOIN Medicos MN ON R.idEspecialidadNueva = MN.idMedico
      INNER JOIN Usuarios U ON R.idUsuario = U.idUsuario
      ORDER BY R.fechaHora DESC
    `);

    res.json({
      status: "OK",
      total: result.recordset.length,
      data: result.recordset,
    });
  } catch (err) {
    console.error("[GET /reasignaciones] Error:", err);
    res.status(500).json({
      status: "ERROR",
      message: "Error al obtener historial de reasignaciones",
      details: err.message,
    });
  }
});

module.exports = router;

