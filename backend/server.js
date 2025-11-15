// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Conexión a BD (pool compartido)
const { getPool } = require('./database');

// Rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const citaRoutes = require('./routes/citaRoutes');
const reportRoutes = require('./routes/reportRoutes');
const reasignacionRoutes = require('./routes/reasignacionRoutes'); // ✅ Nuevo módulo agregado

const app = express();
const PORT = process.env.PORT || 4000;

/* -------------------- Middlewares base -------------------- */
app.use(cors());
app.use(express.json());
// morgan en modo desarrollo (opcional)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* -------------------- Healthcheck simple -------------------- */
app.get('/api/ping', (_req, res) => {
  res.json({ status: 'OK', service: 'API Hospital' });
});

/* -------------------- Montaje de rutas -------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/reportes', reportRoutes);
app.use('/api', reasignacionRoutes); // ✅ Nueva ruta conectada

/* -------------------- 404 para rutas no encontradas -------------------- */
app.use((req, res, _next) => {
  res.status(404).json({
    status: 'ERROR',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

/* -------------------- Manejador global de errores -------------------- */
app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled Error:', err);
  res.status(500).json({
    status: 'ERROR',
    message: 'Error interno del servidor',
    details: err.message
  });
});

/* -------------------- Start -------------------- */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  // Probar conexión a la BD al arrancar (no bloqueante)
  getPool()
    .then(() => console.log('[startup] Conexión a BD OK'))
    .catch((e) => console.error('[startup] Error al inicializar la BD:', e));
});
