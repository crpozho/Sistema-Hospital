// backend/controllers/reportController.js
const sql = require('mssql');
const { getPool } = require('../database');

// Normaliza el rango de fechas a [00:00:00.000, 23:59:59.999]
function getRange(query) {
  const from = query.from ? new Date(query.from) : new Date();
  const to = query.to ? new Date(query.to) : new Date();

  // si no pasan from/to, usa mes actual
  if (!query.from) {
    from.setDate(1);
    from.setHours(0, 0, 0, 0);
  } else {
    from.setHours(0, 0, 0, 0);
  }

  if (!query.to) {
    const last = new Date(from.getFullYear(), from.getMonth() + 1, 0);
    to.setFullYear(last.getFullYear(), last.getMonth(), last.getDate());
  }
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

async function resumen(req, res) {
  try {
    const { from, to } = getRange(req.query);
    const pool = await getPool();

    // Totales (distintos pacientes y médicos, y total de citas) dentro del rango
    const totalsQ = `
      SELECT
        COUNT(*) AS citas,
        COUNT(DISTINCT c.idPaciente) AS pacientes,
        COUNT(DISTINCT c.idMedico)   AS medicos
      FROM Citas c
      WHERE c.fechaHora BETWEEN @from AND @to;
    `;

    // Citas por estado
    const porEstadoQ = `
      SELECT c.estado, COUNT(*) AS total
      FROM Citas c
      WHERE c.fechaHora BETWEEN @from AND @to
      GROUP BY c.estado
      ORDER BY total DESC;
    `;

    // Citas por día
    const porDiaQ = `
      SELECT
        CAST(c.fechaHora AS date) AS fecha,
        COUNT(*) AS total
      FROM Citas c
      WHERE c.fechaHora BETWEEN @from AND @to
      GROUP BY CAST(c.fechaHora AS date)
      ORDER BY fecha ASC;
    `;

    const req1 = pool.request()
      .input('from', sql.DateTime, from)
      .input('to', sql.DateTime, to);

    const [totals, porEstado, porDia] = await Promise.all([
      req1.query(totalsQ),
      pool.request().input('from', sql.DateTime, from).input('to', sql.DateTime, to).query(porEstadoQ),
      pool.request().input('from', sql.DateTime, from).input('to', sql.DateTime, to).query(porDiaQ),
    ]);

    return res.json({
      status: 'OK',
      range: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      totals: totals.recordset[0] || { citas: 0, pacientes: 0, medicos: 0 },
      citasPorEstado: porEstado.recordset,
      citasPorDia: porDia.recordset,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error generando resumen',
      details: String(err.message || err),
    });
  }
}

async function topMedicos(req, res) {
  try {
    const { from, to } = getRange(req.query);
    const pool = await getPool();

    const q = `
      SELECT
        u.idUsuario AS idMedico,
        u.nombre    AS medicoNombre,
        u.usuario   AS medicoUsuario,
        COUNT(*)    AS totalCitas
      FROM Citas c
      INNER JOIN Usuarios u ON u.idUsuario = c.idMedico
      WHERE c.fechaHora BETWEEN @from AND @to
      GROUP BY u.idUsuario, u.nombre, u.usuario
      ORDER BY totalCitas DESC, medicoNombre ASC;
    `;

    const result = await pool.request()
      .input('from', sql.DateTime, from)
      .input('to', sql.DateTime, to)
      .query(q);

    return res.json({
      status: 'OK',
      data: result.recordset,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error generando top de médicos',
      details: String(err.message || err),
    });
  }
}

async function topPacientes(req, res) {
  try {
    const { from, to } = getRange(req.query);
    const pool = await getPool();

    const q = `
      SELECT
        p.idPaciente,
        p.nombre + ' ' + p.apellido AS pacienteNombre,
        COUNT(*) AS totalCitas
      FROM Citas c
      INNER JOIN Pacientes p ON p.idPaciente = c.idPaciente
      WHERE c.fechaHora BETWEEN @from AND @to
      GROUP BY p.idPaciente, p.nombre, p.apellido
      ORDER BY totalCitas DESC, pacienteNombre ASC;
    `;

    const result = await pool.request()
      .input('from', sql.DateTime, from)
      .input('to', sql.DateTime, to)
      .query(q);

    return res.json({
      status: 'OK',
      data: result.recordset,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error generando top de pacientes',
      details: String(err.message || err),
    });
  }
}

module.exports = {
  resumen,
  topMedicos,
  topPacientes,
};
