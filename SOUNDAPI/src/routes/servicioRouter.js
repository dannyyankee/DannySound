const express = require("express");
const router = express.Router();
const {
    getAllServicios,
    getServicioById,
    crearServicioConProductos,
    actualizarServicio,
    eliminarServicio,
    getMisServicios,
    generarFactura
} = require("../controllers/servicioController");
const { checkToken } = require("./middleware");

// Rutas públicas
router.get("/", getAllServicios);

// Rutas protegidas y específicas primero
router.get("/mis-servicios", checkToken, getMisServicios);

// Rutas con parámetro dinámico después
router.get("/:id", getServicioById);

// Rutas protegidas para modificar
router.post("/", checkToken, crearServicioConProductos);
router.put("/:id", checkToken, actualizarServicio);
router.delete("/:id", checkToken, eliminarServicio);

// Generación de factura en PDF
router.get("/factura/:id", generarFactura);

module.exports = router;
