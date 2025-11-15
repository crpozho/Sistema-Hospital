// backend/routes/pacienteRoutes.js

const express = require('express');
const router = express.Router();

// Middlewares
const auth = require('../middlewares/authMiddleware');          // debe exportar una función (req,res,next)
const requireRole = require('../middlewares/roleMiddleware');   // esta línea usa el export por defecto del archivo anterior

// Controladores
const {
  listarPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} = require('../controllers/pacienteController');

/**
 * Rutas Pacientes
 */
router.get('/', auth, listarPacientes);                                        // cualquiera autenticado
router.post('/', auth, requireRole('ADMIN', 'RECEPCION'), crearPaciente);      // ADMIN o RECEPCION
router.put('/:id', auth, requireRole('ADMIN', 'RECEPCION'), actualizarPaciente);// ADMIN o RECEPCION
router.delete('/:id', auth, requireRole('ADMIN'), eliminarPaciente);           // solo ADMIN

module.exports = router;
