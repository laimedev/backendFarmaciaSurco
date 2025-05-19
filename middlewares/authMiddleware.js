const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const tokenValido = token.replace("Bearer ", "");
    const decoded = jwt.verify(tokenValido, process.env.JWT_SECRET);

    req.usuario = decoded; // Guardar usuario en la solicitud

    // Verificar si el token expira en menos de 60 segundos
    const tiempoRestante = decoded.exp * 1000 - Date.now();
    if (tiempoRestante < 60000) {
      const nuevoToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "2m" }
      );

      res.setHeader("new-token", nuevoToken);
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};
