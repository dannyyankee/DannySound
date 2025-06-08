const express = require("express");
const middleware = require("./middleware");

const usuarioRouter = require("./usuarioRouter");
const productoRouter = require("./productoRouter");
const servicioRouter = require("./servicioRouter");
const detalleServicioRouter = require("./detalleServicioRouter");
const resenaRouter = require("./resenaRouter");


const router = express.Router();

router.use("/usuarios", usuarioRouter);
router.use("/productos", productoRouter);
router.use("/servicios", servicioRouter);
router.use("/detalleservicio", detalleServicioRouter);
router.use("/resenas", resenaRouter);


module.exports = router;
