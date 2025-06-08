const jwt = require("jwt-simple");
const moment = require("moment");

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Falta Token" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = parts[1];

  let payload = null;
  try {
    payload = jwt.decode(token, process.env.JWT_SECRET || "secret_key");
  } catch (error) {
    return res.status(401).json({ error: "Token incorrecto" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.status(401).json({ error: "El token ha expirado, debe volver a autenticarse" });
  }

  // Guarda info útil del usuario en req.user, incluyendo el DNI
  req.user = {
    id: payload.usuarioId,
    dni: payload.dni, // Ajusta si en tu token el campo tiene otro nombre
  };

  next();
};

module.exports = { checkToken };
