// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      status: 'ERROR',
      message: 'No se envió el token (Authorization header)',
    });
  }

  const [bearer, token] = authHeader.split(' ');
  if (!token || bearer !== 'Bearer') {
    return res.status(401).json({
      status: 'ERROR',
      message: 'Formato de token inválido. Use: Bearer <token>',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // LOGS de depuración
    console.log('--- AUTH MIDDLEWARE ---');
    console.log('payload:', payload);
    console.log('-----------------------');

    req.user = {
      idUsuario: payload.idUsuario,
      usuario: payload.usuario,
      rol: payload.rol,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'ERROR',
      message: 'Token inválido o expirado',
      details: error.message,
    });
  }
}

module.exports = authMiddleware;
