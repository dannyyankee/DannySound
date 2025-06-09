const usuarioService = require("../services/usuarioService");
const { sendContactEmail } = require("../services/emailService");

class UsuarioController {
  static async getUsers(req, res) {
    try {
      const rol = req.query.rol;
      const users = await usuarioService.getAllUsuarios(rol);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const result = await usuarioService.login(req);
      if (result.ok) {
        res.status(200).json(result);
      } else {
        res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
      }
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async getUnUsuarioCorreo(req, res) {
    try {
      const usuario = await usuarioService.getUnUsuarioCorreo(req.params.correo);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async register(req, res) {
    try {
      const usuario = await usuarioService.register(req.body);
      res.status(201).json({ mensaje: "Usuario registrado correctamente", data: usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUsuario(req, res) {
    try {
      const updated = await usuarioService.updateUsuario(req.body, req.params.correo);
      if (updated) {
        res.status(200).json({ mensaje: `Usuario ${req.params.correo} actualizado` });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado o sin cambios" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async remove(req, res) {
    try {
      const deleted = await usuarioService.remove(req.params.correo);
      if (deleted) {
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async me(req, res) {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    try {
      const usuario = await usuarioService.getUnUsuarioPorDni(req.user.id);
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({
        dni: usuario.dni,
        correo: usuario.correo,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno al obtener usuario" });
    }
  }

  // Método para resetear la contraseña y enviar email
  static async resetPassword(req, res) {
    try {
      const { correo } = req.body;
      if (!correo) {
        return res.status(400).json({ mensaje: "El correo es obligatorio" });
      }
      const result = await usuarioService.recuperarPassword(correo);
      if (result) {
        res.json({ mensaje: "Nueva contraseña enviada al correo" });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado o error enviando correo" });
      }
    } catch (error) {
      console.error("Error en resetPassword:", error);
      res.status(500).json({ mensaje: error.message || "Error interno del servidor" });
    }
  }

  // Método para enviar correo de contacto
  static async sendContactEmail(req, res) {
    try {
      const { nombre, apellido, email, asunto, mensaje } = req.body;
      if (!email || !mensaje) {
        return res.status(400).json({ mensaje: "Email y mensaje obligatorios" });
      }
      await sendContactEmail({ nombre, apellido, email, asunto, mensaje });
      res.json({ mensaje: "Correo enviado correctamente" });
    } catch (error) {
      console.error("Error enviando email de contacto:", error);
      res.status(500).json({ mensaje: "Error enviando el correo" });
    }
  }
  // Método para cambiar la contraseña del usuario autenticado
  static async cambiarContrasenaSinToken(req, res) {
    try {
      const { correo, currentPassword, newPassword, repeatNewPassword } = req.body;

      if (!correo || !currentPassword || !newPassword || !repeatNewPassword) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
      }
      if (newPassword !== repeatNewPassword) {
        return res.status(400).json({ mensaje: "Las nuevas contraseñas no coinciden" });
      }

      await usuarioService.cambiarContrasenaSinToken(correo, currentPassword, newPassword);
      res.json({ mensaje: "Contraseña cambiada correctamente" });
    } catch (error) {
      if (error.message === "Contraseña actual incorrecta") {
        return res.status(401).json({ mensaje: error.message });
      }
      if (error.message.includes("longitud")) {
        return res.status(400).json({ mensaje: error.message });
      }
      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({ mensaje: error.message });
      }
      console.error("Error cambiarContrasenaSinToken:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }
  // Método para cambiar el rol de un usuario
  static async cambiarRolUsuario(req, res) {
    const { dni } = req.params;
    const { rol } = req.body;

    if (!["cliente", "dueño", "admin"].includes(rol)) {
      return res.status(400).json({ mensaje: "Rol no válido" });
    }

    try {
      const actualizado = await usuarioService.actualizarRol(dni, rol);
      if (actualizado) {
        res.json({ mensaje: `Rol actualizado a ${rol}` });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error cambiarRolUsuario:", error);
      res.status(500).json({ mensaje: "Error al cambiar el rol del usuario" });
    }
  }


}

module.exports = UsuarioController;
