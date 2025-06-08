const { Servicio, Producto, DetalleServicio, Usuario } = require("../database/associations");
const path = require("path");
const { generarFacturaServicio } = require("../services/pdfService");
const { enviarFacturaPorCorreo } = require("../services/emailService");


const generarFactura = async (req, res) => {
  try {
    const id_servicio = req.params.id;
    const metodo_pago = req.query.metodo_pago || "No especificado";
    const correo_cliente = req.query.correo_cliente; // ⬅️ Email opcional desde el frontend

    // Obtener servicio con cliente incluido
    const servicio = await Servicio.findByPk(id_servicio, {
      include: [
        {
          model: Usuario,
          as: "cliente",
          attributes: ["nombre", "correo"]
        }
      ]
    });

    if (!servicio) return res.status(404).json({ message: "Servicio no encontrado" });

    // Generar PDF
    const ruta = await generarFacturaServicio(id_servicio, metodo_pago);

    // Enviar al dueño del servicio
    await enviarFacturaPorCorreo(servicio.cliente.correo, servicio.cliente.nombre, ruta);

    // Enviar también al cliente (si se proporcionó)
    if (correo_cliente) {
      await enviarFacturaPorCorreo(correo_cliente, "Cliente", ruta);
    }

    // Descargar en navegador
    res.download(ruta, (err) => {
      if (err) {
        console.error("Error al descargar factura:", err);
        res.status(500).send("Error al descargar factura.");
      } else {
        console.log("Factura enviada y descargada correctamente");
      }
    });

  } catch (error) {
    console.error("Error generando factura:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los servicios (sin filtro)
const getAllServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({
      include: [
        { model: Usuario, as: "cliente", attributes: ["dni", "nombre", "correo"] },
        { model: DetalleServicio, as: "detalles", include: { model: Producto, as: "producto" } }
      ]
    });
    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo servicios" });
  }
};

// Obtener servicio por ID
const getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: "cliente", attributes: ["dni", "nombre", "correo"] },
        { model: DetalleServicio, as: "detalles", include: { model: Producto, as: "producto" } }
      ]
    });
    if (!servicio) return res.status(404).json({ message: "Servicio no encontrado" });
    res.json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo servicio" });
  }
};

// Crear servicio con productos - dni_cliente tomado del usuario autenticado
const crearServicioConProductos = async (req, res) => {
  try {
    const dni_cliente = req.user.dni; // dni extraído del token/autenticación
    const { fecha_inicio, fecha_fin, productos } = req.body;

    const servicio = await Servicio.create({ dni_cliente, fecha_inicio, fecha_fin });

    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);
    let dias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    if (dias < 1) dias = 1;

    const detalles = [];
    for (const p of productos) {
      const producto = await Producto.findByPk(p.id_producto);
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado: " + p.id_producto });
      }
      const cantidad = p.cantidad && Number(p.cantidad) > 0 ? Number(p.cantidad) : 1;
      const precioTotal = producto.precio_dia * cantidad * dias;

      detalles.push({
        id_servicio: servicio.id_servicio,
        id_producto: p.id_producto,
        cantidad,
        precio_total: precioTotal.toFixed(2)
      });
    }

    await DetalleServicio.bulkCreate(detalles);

    res.status(201).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando servicio con productos" });
  }
};

// Obtener servicios del cliente autenticado
const getMisServicios = async (req, res) => {
  try {
    const dni_cliente = req.user.dni;
    // consulta usando dni_cliente del token
    const servicios = await Servicio.findAll({
      where: { dni_cliente },
      include: [
        { model: Usuario, as: "cliente", attributes: ["dni", "nombre", "correo"] },
        { model: DetalleServicio, as: "detalles", include: { model: Producto, as: "producto" } }
      ]
    });
    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo servicios del cliente" });
  }
};


// Actualizar servicio
const actualizarServicio = async (req, res) => {
  try {
    const updated = await Servicio.update(req.body, { where: { id_servicio: req.params.id } });
    if (updated[0] === 0) {
      return res.status(404).json({ message: "Servicio no encontrado para actualizar" });
    }
    res.json({ message: "Servicio actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando servicio" });
  }
};

// Eliminar servicio
const eliminarServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);

    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado para eliminar" });
    }

    const hoy = new Date();
    const fechaInicio = new Date(servicio.fecha_inicio);

    if (hoy >= fechaInicio) {
      return res.status(400).json({ message: "No se puede cancelar un servicio iniciado o pasado" });
    }

    await servicio.destroy();
    return res.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error eliminando servicio" });
  }
};

module.exports = {
  getAllServicios,
  getServicioById,
  crearServicioConProductos,
  getMisServicios,
  actualizarServicio,
  generarFactura,
  eliminarServicio,
};
