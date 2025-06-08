const Producto = require("../database/models/Producto");
const Servicio = require("../database/models/Servicio");
const DetalleServicio = require("../database/models/DetalleServicio");
const { Op } = require("sequelize");

const getAllProductos = async () => {
  try {
    return await Producto.findAll({ raw: true });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }
};

const getProductoById = async (id) => {
  try {
    return await Producto.findOne({ where: { id_producto: id } });
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    throw error;
  }
};

const crearProducto = async (data, id_dueño) => {
  try {
    data.id_dueño = id_dueño;
    return await Producto.create(data);
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
};

const actualizarProducto = async (id, data, id_dueño_solicitante) => {
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) throw new Error("Producto no encontrado");
    if (producto.id_dueño !== id_dueño_solicitante) {
      throw new Error("No tienes permiso para modificar este producto");
    }
    await producto.update(data);
    return producto;
  } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
  }
};

const eliminarProducto = async (id, id_dueño_solicitante) => {
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) throw new Error("Producto no encontrado");
    if (producto.id_dueño !== id_dueño_solicitante) {
      throw new Error("No tienes permiso para eliminar este producto");
    }
    return await Producto.destroy({ where: { id_producto: id } });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    throw error;
  }
};
const verificarDisponibilidad = async (fechaInicio, fechaFin, productos) => {
  if (!fechaInicio || !fechaFin || !Array.isArray(productos)) {
    throw new Error("Datos de entrada inválidos: faltan fechas o productos");
  }

  const disponibilidad = [];

  for (const item of productos) {
    const id_producto = parseInt(item.id_producto);
    const cantidadSolicitada = parseInt(item.cantidad);

    if (isNaN(id_producto) || isNaN(cantidadSolicitada)) {
      disponibilidad.push({ nombre: `Datos inválidos: ${JSON.stringify(item)}`, disponible: false });
      continue;
    }

    const producto = await Producto.findByPk(id_producto);

    if (!producto) {
      disponibilidad.push({ nombre: 'Producto no encontrado', disponible: false });
      continue;
    }

    // Buscar servicios que se solapen en fechas y usen ese producto
    const serviciosCoincidentes = await Servicio.findAll({
      where: {
        [Op.or]: [
          { fecha_inicio: { [Op.between]: [fechaInicio, fechaFin] } },
          { fecha_fin: { [Op.between]: [fechaInicio, fechaFin] } },
          {
            fecha_inicio: { [Op.lte]: fechaInicio },
            fecha_fin: { [Op.gte]: fechaFin }
          }
        ]
      },
      include: [{
        model: DetalleServicio,
        as: 'DetalleServicios',
        required: false,
        where: { id_producto }
      }]
    });

    let cantidadAlquilada = 0;

    for (const servicio of serviciosCoincidentes) {
      if (Array.isArray(servicio.DetalleServicios)) {
        for (const detalle of servicio.DetalleServicios) {
          if (detalle && typeof detalle.cantidad === 'number') {
            cantidadAlquilada += detalle.cantidad;
          }
        }
      }
    }

    const cantidadDisponible = producto.disponible - cantidadAlquilada;

    disponibilidad.push({
      id_producto,
      nombre: producto.nombre,
      cantidadDisponible,
      solicitado: cantidadSolicitada,
      disponible: cantidadDisponible >= cantidadSolicitada
    });
  }

  return disponibilidad;
};

module.exports = {
  getAllProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  verificarDisponibilidad,
};
