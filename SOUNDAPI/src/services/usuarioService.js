const Usuario = require("../database/models/Usuario");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jwt-simple");

const { sendPasswordRecoveryEmailTest } = require("../services/emailService");

const recuperarPassword = async (correo) => {
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) throw new Error("No existe un usuario con ese correo");

  const nuevaClave = Math.random().toString(36).slice(-8);
  const claveEncriptada = await bcrypt.hash(nuevaClave, 10);

  await usuario.update({ clave: claveEncriptada });

  const enviado = await sendPasswordRecoveryEmailTest({
    nombre: usuario.nombre,
    apellido: usuario.apellidos || '',
    nuevaClave,
    correo: usuario.correo
  });

  if (!enviado) {
    throw new Error("Error al enviar correo de recuperación");
  }

  return true;
};
const createToken = (usuario) => {
  const payload = {
    usuarioId: usuario.dni,  // si quieres mantener este campo igual, o puedes cambiar a usuarioId: usuario.id si usas otro
    dni: usuario.dni,        // añadimos el dni aquí para que esté en el token
    createdAt: moment().unix(),
    expiredAt: moment().add(8, "hours").unix(),
  };
  return jwt.encode(payload, process.env.JWT_SECRET || "secret_key");
};

const login = async (req) => {
  try {
    const { correo, clave } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return { error: "Usuario o contraseña incorrectos" };

    const isValid = await bcrypt.compare(clave, usuario.clave);
    if (!isValid) return { error: "Usuario o contraseña incorrectos" };

    const token = createToken(usuario);
    return {
      ok: true,
      token,
      usuario: {
        dni: usuario.dni,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  } catch (error) {
    console.error("Error en login:", error);
    return { error: "Error interno en login" };
  }
};

const register = async (data) => {
  try {
    const hashedPassword = await bcrypt.hash(data.clave, 10);
    const nuevoUsuario = await Usuario.create({
      dni: data.dni,
      nombre: data.nombre,
      apellidos: data.apellidos,
      correo: data.correo,
      clave: hashedPassword,
      rol: data.rol || "cliente",
    });
    return nuevoUsuario;
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
};

const getAllUsuarios = async (rol) => {
  if (rol) {
    return await Usuario.findAll({ where: { rol } });
  }
  return await Usuario.findAll();
};

const getUnUsuarioCorreo = async (correo) => {
  return await Usuario.findOne({ where: { correo } });
};

const getUnUsuarioPorDni = async (dni) => {
  return await Usuario.findOne({ where: { dni } });
};

const updateUsuario = async (data, correo) => {
  const [updated] = await Usuario.update(data, { where: { correo } });
  return updated;
};

const remove = async (correo) => {
  const deleted = await Usuario.destroy({ where: { correo } });
  return deleted;
};

const cambiarContrasenaSinToken = async (correo, currentPassword, newPassword) => {
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) throw new Error("Usuario no encontrado");

  const coincide = await bcrypt.compare(currentPassword, usuario.clave);
  if (!coincide) throw new Error("Contraseña actual incorrecta");

  if (newPassword.length < 8 || newPassword.length > 16) {
    throw new Error("La nueva contraseña debe tener entre 8 y 16 caracteres");
  }

  const hashNueva = await bcrypt.hash(newPassword, 10);
  usuario.clave = hashNueva;
  await usuario.save();

  return true;
};

const actualizarRol = async (dni, nuevoRol) => {
  const [actualizado] = await Usuario.update({ rol: nuevoRol }, { where: { dni } });
  return actualizado;
};

module.exports = {
  login,
  register,
  createToken,
  getAllUsuarios,
  getUnUsuarioCorreo,
  getUnUsuarioPorDni,
  updateUsuario,
  remove,
  actualizarRol,
  cambiarContrasenaSinToken,
  recuperarPassword,
};
