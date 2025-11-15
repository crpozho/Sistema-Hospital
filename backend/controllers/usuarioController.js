// backend/controllers/usuarioController.js

const {
  obtenerUsuarios,
  crearUsuario
} = require('../models/usuarioModel');

// 🔹 GET /usuarios
async function listarUsuarios(req, res) {
  try {
    const usuarios = await obtenerUsuarios();
    return res.json({
      status: 'OK',
      usuarios
    });
  } catch (error) {
    console.error('Error al listar usuarios:', error.message);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error al obtener usuarios',
      details: error.message
    });
  }
}

// 🔹 POST /usuarios
async function registrarUsuario(req, res) {
  const { nombre, usuario, password, rol, estado } = req.body;

  if (!nombre || !usuario || !password || !rol) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'nombre, usuario, password y rol son obligatorios'
    });
  }

  try {
    await crearUsuario({
      nombre,
      usuario,
      password,
      rol,
      estado: estado ?? 1
    });

    return res.status(201).json({
      status: 'OK',
      message: 'Usuario creado correctamente'
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error al registrar usuario',
      details: error.message
    });
  }
}

module.exports = {
  listarUsuarios,
  registrarUsuario
};
