// backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const { autenticarUsuario } = require('../models/usuarioModel');

// 🔹 Login con usuario + password
async function login(req, res) {
  const { usuario, password } = req.body;

  // Validar datos de entrada
  if (!usuario || !password) {
    return res.status(400).json({
      status: "ERROR",
      message: "Debe enviar usuario y password"
    });
  }

  try {
    // Buscar usuario en la BD
    const usuarioDB = await autenticarUsuario({ usuario, password });

    if (!usuarioDB) {
      return res.status(401).json({
        status: "ERROR",
        message: "Credenciales incorrectas"
      });
    }

    // Crear JWT (válido 8 horas)
    const token = jwt.sign(
      {
        idUsuario: usuarioDB.idUsuario,
        usuario: usuarioDB.usuario,
        rol: usuarioDB.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Respuesta OK
    return res.json({
      status: "OK",
      message: "Login exitoso",
      token,
      usuario: {
        idUsuario: usuarioDB.idUsuario,
        nombre: usuarioDB.nombre,
        usuario: usuarioDB.usuario,
        rol: usuarioDB.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      status: "ERROR",
      message: "Error en el servidor",
      details: error.message
    });
  }
}

module.exports = {
  login
};
