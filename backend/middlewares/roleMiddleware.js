// backend/middlewares/roleMiddleware.js

/**
 * Devuelve un middleware de Express que valida que el usuario
 * autenticado (en req.user) tenga uno de los roles permitidos.
 *
 * Uso:
 *   router.post('/', auth, requireRole('ADMIN', 'RECEPCION'), handler)
 */
function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      // req.user lo setea authMiddleware al verificar el JWT
      const rolUsuario = req.user?.rol;

      if (!rolUsuario) {
        return res.status(401).json({
          status: 'ERROR',
          message: 'No autenticado o token inválido',
        });
      }

      // ¿El rol del usuario está dentro de los permitidos?
      const permitido = rolesPermitidos.includes(rolUsuario);

      if (!permitido) {
        return res.status(403).json({
          status: 'ERROR',
          message: 'No tiene permisos para acceder a esta ruta',
        });
      }

      return next();
    } catch (err) {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error validando rol',
        details: err.message,
      });
    }
  };
}

module.exports = requireRole;
