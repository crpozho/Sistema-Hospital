// backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

const {
  listarUsuarios,
  registrarUsuario
} = require('../controllers/usuarioController');

// Listar: cualquier usuario autenticado
router.get('/', auth, listarUsuarios);

// Crear: SOLO ADMIN
router.post('/', auth, requireRole('ADMIN'), registrarUsuario);

module.exports = router;
