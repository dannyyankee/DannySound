// routes/resenaRouter.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/resenaController");
const { checkToken } = require("../routes/middleware");

router.get("/", controller.obtenerResenas);
router.post("/", checkToken, controller.crearResena);

module.exports = router;
