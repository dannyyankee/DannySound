const express = require("express");
const ProductoController = require("../controllers/productoController");
const middleware = require("./middleware");

const router = express.Router();

router.get("/all", middleware.checkToken, ProductoController.listarProductos);
router.post("/create", middleware.checkToken, ProductoController.crearProducto);
router.put("/modify/:id", middleware.checkToken, ProductoController.actualizarProducto);
router.delete("/delete/:id", middleware.checkToken, ProductoController.eliminarProducto);
router.get("/:id", middleware.checkToken, ProductoController.getProductoById);
router.post("/disponibilidad", middleware.checkToken, ProductoController.verificarDisponibilidad);

module.exports = router;
