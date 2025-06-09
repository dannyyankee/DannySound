const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");
const middleware = require("./middleware");

router.get("/", UsuarioController.getUsers);
router.post("/login", UsuarioController.login);
router.post("/register", UsuarioController.register);
router.post("/reset-password", UsuarioController.resetPassword);
router.get("/me", middleware.checkToken, UsuarioController.me);
router.get("/:correo", UsuarioController.getUnUsuarioCorreo);
router.put("/:correo", UsuarioController.updateUsuario);
router.delete("/:correo", UsuarioController.remove);
router.post('/send-contact-email', UsuarioController.sendContactEmail);
router.post('/change-password-no-token', UsuarioController.cambiarContrasenaSinToken);
router.put('/:dni/rol', middleware.checkToken, UsuarioController.cambiarRolUsuario);

module.exports = router;
