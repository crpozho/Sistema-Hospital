// backend/routes/citaRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

const {
  getCitas,
  postCita,
  putCita,
  deleteCita,
} = require('../controllers/citaController');

/**
 * GET /citas
 * Roles: ADMIN, RECEPCION, MEDICO (cualquier autenticado)
 */
router.get('/', auth, getCitas);

/**
 * POST /citas
 * Roles: ADMIN, RECEPCION
 * Body: { idPaciente, idMedico, fechaHora, motivo?, estado? }
 */
router.post('/', auth, requireRole('ADMIN', 'RECEPCION'), postCita);

/**
 * PUT /citas/:id
 * Roles: ADMIN, MEDICO
 * Body: { idPaciente, idMedico, fechaHora, motivo, estado }
 */
router.put('/:id', auth, requireRole('ADMIN', 'MEDICO'), putCita);

/**
 * DELETE /citas/:id
 * Rol: ADMIN
 */
router.delete('/:id', auth, requireRole('ADMIN'), deleteCita);

module.exports = router;
