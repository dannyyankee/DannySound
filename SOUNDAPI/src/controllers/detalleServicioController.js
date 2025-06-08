const detalleServicioService = require("../services/detalleServicioService");

class DetalleServicioController {
  static async listarDetalles(req, res) {
    try {
      const detalles = await detalleServicioService.getAllDetalles();
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener detalles", error: error.message });
    }
  }

  static async getDetalleById(req, res) {
    try {
      const detalle = await detalleServicioService.getDetalleById(req.params.id_servicio, req.params.id_producto);
      if (detalle) {
        res.status(200).json(detalle);
      } else {
        res.status(404).json({ mensaje: "Detalle no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener detalle", error: error.message });
    }
  }

  static async crearDetalle(req, res) {
    try {
      const nuevoDetalle = await detalleServicioService.crearDetalle(req.body);
      res.status(201).json(nuevoDetalle);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al crear detalle", error: error.message });
    }
  }

  static async actualizarDetalle(req, res) {
    try {
      const actualizado = await detalleServicioService.actualizarDetalle(req.body, req.params.id_servicio, req.params.id_producto);
      if (actualizado) {
        res.status(200).json({ mensaje: "Detalle actualizado correctamente" });
      } else {
        res.status(404).json({ mensaje: "Detalle no encontrado o no modificado" });
      }
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar detalle", error: error.message });
    }
  }

  static async eliminarDetalle(req, res) {
    try {
      const eliminado = await detalleServicioService.eliminarDetalle(req.params.id_servicio, req.params.id_producto);
      if (eliminado) {
        res.status(200).json({ mensaje: "Detalle eliminado correctamente" });
      } else {
        res.status(404).json({ mensaje: "Detalle no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar detalle", error: error.message });
    }
  }
}

module.exports = DetalleServicioController;
