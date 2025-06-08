const productoService = require("../services/productoService");
const Usuario = require('../database/models/Usuario');


const listarProductos = async (req, res) => {
  try {
    const user = await Usuario.findOne({ where: { dni: req.user.dni } });
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    let productos = await productoService.getAllProductos();

    if (!Array.isArray(productos)) {
      throw new Error("Los productos obtenidos no son un array");
    }

    if (user.rol.toLowerCase() === "dueño") {
      productos = productos.filter(p => p.id_dueño === user.dni);
    }

    res.json(productos);
  } catch (error) {
    console.error("Error listando productos:", error);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
};

const crearProducto = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    const producto = await productoService.crearProducto(data, user.dni);
    res.status(201).json(producto);
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({ error: "Error creando producto" });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const data = req.body;
    const producto = await productoService.actualizarProducto(id, data, user.dni);
    res.json(producto);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(403).json({ error: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    await productoService.eliminarProducto(id, user.dni);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    res.status(403).json({ error: error.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    const producto = await productoService.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    console.error("Error obteniendo producto por id:", error);
    res.status(500).json({ error: "Error obteniendo producto" });
  }
};
const verificarDisponibilidad = async (req, res) => {
  try {
    const { productos, fechaInicio, fechaFin } = req.body;
    const disponibilidad = await productoService.verificarDisponibilidad(fechaInicio, fechaFin, productos);
    res.json(disponibilidad);
  } catch (error) {
    console.error("Error en verificarDisponibilidad:", error);
    res.status(500).json({ message: "Error al comprobar disponibilidad" });
  }
};

module.exports = {
  listarProductos,
  crearProducto,
  actualizarProducto,
  verificarDisponibilidad,
  eliminarProducto,
  getProductoById,  // <-- Asegúrate de exportarlo
};
