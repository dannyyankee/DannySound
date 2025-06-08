const express = require("express");
const DetalleServicioController = require("../controllers/DetalleServicioController");
const middleware = require("./middleware");

const router = express.Router();

router.get("/all", middleware.checkToken, DetalleServicioController.listarDetalles);
router.get("/:id_servicio/:id_producto", middleware.checkToken, DetalleServicioController.getDetalleById);
router.post("/create", middleware.checkToken, DetalleServicioController.crearDetalle);
router.put("/modify/:id_servicio/:id_producto", middleware.checkToken, DetalleServicioController.actualizarDetalle);
router.delete("/delete/:id_servicio/:id_producto", middleware.checkToken, DetalleServicioController.eliminarDetalle);

module.exports = router;
