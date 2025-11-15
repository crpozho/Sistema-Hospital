const pool = require('../database');

// Utilidad para normalizar rango
function normalizeRange(desde, hasta) {
  // Si no envían fechas, usamos los últimos 30 días
  const today = new Date();
  const d30 = new Date();
  d30.setDate(today.getDate() - 30);

  const start = desde ? new Date(desde) : d30;
  const end   = hasta ? new Date(hasta) : today;

  // Forzamos a ISO sin hora (usado por SQL Server con datetimeoffset/varchar)
  const ymd = (d) => d.toISOString().slice(0,10);
  return { desde: ymd(start), hasta: ymd(end) };
}

async function getResumen() {
  const request = pool.request();
  // Usuarios por rol
  const qUsuarios = `
    SELECT rol, COUNT(*) AS total
    FROM Usuarios
    GROUP BY rol
  `;

  // Pacientes totales
  const qPacientes = `SELECT COUNT(*) AS total FROM Pacientes`;

  // Citas por estado
  const qCitasEstado = `
    SELECT estado, COUNT(*) AS total
    FROM Citas
    GROUP BY estado
  `;

  // Citas de hoy
  const qCitasHoy = `
    SELECT COUNT(*) AS total
    FROM Citas
    WHERE CONVERT(date, fechaHora) = CONVERT(date, GETDATE())
  `;

  const r1 = await request.query(qUsuarios);
  const r2 = await pool.request().query(qPacientes);
  const r3 = await pool.request().query(qCitasEstado);
  const r4 = await pool.request().query(qCitasHoy);

  return {
    usuariosPorRol: r1.recordset,        // [{rol:'ADMIN',total:1}, ...]
    pacientes: r2.recordset[0]?.total || 0,
    citasPorEstado: r3.recordset,        // [{estado:'PROGRAMADA', total: X}, ...]
    citasHoy: r4.recordset[0]?.total || 0
  };
}

async function getCitasPorMedico({ desde, hasta }) {
  const range = normalizeRange(desde, hasta);
  const sql = `
    SELECT  u.idUsuario AS idMedico,
            u.nombre    AS medicoNombre,
            u.usuario   AS medicoUsuario,
            COUNT(*)    AS total
    FROM Citas c
    JOIN Usuarios u ON u.idUsuario = c.idMedico
    WHERE CONVERT(date, c.fechaHora) BETWEEN @desde AND @hasta
    GROUP BY u.idUsuario, u.nombre, u.usuario
    ORDER BY total DESC
    OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;
  `;
  const req = pool.request();
  req.input('desde', range.desde);
  req.input('hasta', range.hasta);
  const rs = await req.query(sql);
  return rs.recordset;
}

async function getCitasPorDia({ desde, hasta }) {
  const range = normalizeRange(desde, hasta);
  const sql = `
    SELECT CONVERT(date, c.fechaHora) AS fecha, COUNT(*) AS total
    FROM Citas c
    WHERE CONVERT(date, c.fechaHora) BETWEEN @desde AND @hasta
    GROUP BY CONVERT(date, c.fechaHora)
    ORDER BY fecha ASC;
  `;
  const req = pool.request();
  req.input('desde', range.desde);
  req.input('hasta', range.hasta);
  const rs = await req.query(sql);
  return rs.recordset; // [{fecha:'2025-11-10', total:5},...]
}

async function getPacientesPorSeguro() {
  const sql = `
    SELECT 
      COALESCE(NULLIF(LTRIM(RTRIM(seguro)), ''), 'SIN SEGURO') AS seguro,
      COUNT(*) AS total
    FROM Pacientes
    GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(seguro)), ''), 'SIN SEGURO')
    ORDER BY total DESC;
  `;
  const rs = await pool.request().query(sql);
  return rs.recordset;
}

async function getProductividadMedico({ idMedico, desde, hasta }) {
  const range = normalizeRange(desde, hasta);
  const sql = `
    SELECT estado, COUNT(*) AS total
    FROM Citas
    WHERE idMedico = @idMedico
      AND CONVERT(date, fechaHora) BETWEEN @desde AND @hasta
    GROUP BY estado
  `;
  const req = pool.request();
  req.input('idMedico', idMedico);
  req.input('desde', range.desde);
  req.input('hasta', range.hasta);
  const rs = await req.query(sql);
  return rs.recordset; // [{estado:'PROGRAMADA',total:X},...]
}

module.exports = {
  getResumen,
  getCitasPorMedico,
  getCitasPorDia,
  getPacientesPorSeguro,
  getProductividadMedico,
};
