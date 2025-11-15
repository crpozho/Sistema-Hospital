// backend/models/reporteModel.js
const { getPool } = require('../config/db');

/**
 * Obtiene datos para el dashboard:
 * - Resumen (totales)
 * - Citas por estado
 * - Citas por médico
 * - Próximas 5 citas
 */
async function obtenerResumen() {
  const pool = await getPool();

  // Totales principales
  const totales = await pool.request().query(`
    SELECT
      (SELECT COUNT(*) FROM Pacientes WHERE estado = 1)                                         AS totalPacientesActivos,
      (SELECT COUNT(*) FROM Citas WHERE estado IN ('PROGRAMADA','REPROGRAMADA'))                AS citasPendientes,
      (SELECT COUNT(*) FROM Citas WHERE CONVERT(date, fechaHora) = CONVERT(date, GETDATE()))    AS citasHoy,
      (SELECT COUNT(*) FROM Citas WHERE estado = 'CANCELADA')                                    AS citasCanceladas,
      (SELECT COUNT(*) FROM Citas WHERE estado = 'ATENDIDA')                                     AS citasAtendidas
  `);

  // Distribución por estado
  const porEstado = await pool.request().query(`
    SELECT estado, COUNT(*) AS total
    FROM Citas
    GROUP BY estado
    ORDER BY estado
  `);

  // Citas agrupadas por médico (top por cantidad)
  const porMedico = await pool.request().query(`
    SELECT 
      u.idUsuario       AS idMedico,
      u.nombre          AS medico,
      COUNT(*)          AS total
    FROM Citas c
    INNER JOIN Usuarios u ON u.idUsuario = c.idMedico
    GROUP BY u.idUsuario, u.nombre
    ORDER BY total DESC
  `);

  // Próximas 5 citas (programadas o reprogramadas)
  const proximas = await pool.request().query(`
    SELECT TOP 5
      c.idCita,
      c.fechaHora,
      c.motivo,
      c.estado,
      (p.nombre + ' ' + p.apellido) AS paciente,
      u.nombre                      AS medico
    FROM Citas c
    INNER JOIN Pacientes p ON p.idPaciente = c.idPaciente
    INNER JOIN Usuarios  u ON u.idUsuario  = c.idMedico
    WHERE c.estado IN ('PROGRAMADA','REPROGRAMADA')
      AND c.fechaHora >= GETDATE()
    ORDER BY c.fechaHora ASC
  `);

  return {
    resumen: totales.recordset[0] || {},
    citasPorEstado: porEstado.recordset || [],
    citasPorMedico: porMedico.recordset || [],
    proximasCitas: proximas.recordset || []
  };
}

module.exports = {
  obtenerResumen
};
