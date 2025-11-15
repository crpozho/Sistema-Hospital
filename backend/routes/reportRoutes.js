// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const ReportController = require('../controllers/reportController');

// (debug opcional para ver que el router carga)
console.log('[routes/reportes] router cargado');

// GET /api/reportes/resumen?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get(
  '/resumen',
  auth,
  requireRole('ADMIN', 'RECEPCION'),
  ReportController.resumen
);

// GET /api/reportes/top-medicos?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get(
  '/top-medicos',
  auth,
  requireRole('ADMIN', 'RECEPCION'),
  ReportController.topMedicos
);

// GET /api/reportes/top-pacientes?from=YYYY-MM-DD&to=YYYY-MM-DD
// (lo dejaremos listo para el siguiente paso)
router.get(
  '/top-pacientes',
  auth,
  requireRole('ADMIN', 'RECEPCION'),
  ReportController.topPacientes
);

module.exports = router;
