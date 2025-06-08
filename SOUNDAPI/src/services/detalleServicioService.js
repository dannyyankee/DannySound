const DetalleServicio = require("../database/models/DetalleServicio");

// OBTENER TODOS LOS DETALLES DE SERVICIO
const getAllDetalles = async () => {
    try {
        return await DetalleServicio.findAll();
    } catch (error) {
        console.error("Error obteniendo detalles de servicio:", error);
        throw error;
    }
};

// OBTENER DETALLE POR ID DE SERVICIO Y PRODUCTO
const getDetalleById = async (id_servicio, id_producto) => {
    try {
        return await DetalleServicio.findOne({
            where: { id_servicio, id_producto },
        });
    } catch (error) {
        console.error("Error obteniendo detalle de servicio:", error);
        throw error;
    }
};

// CREAR DETALLE DE SERVICIO
const crearDetalle = async (data) => {
    try {
        return await DetalleServicio.create(data);
    } catch (error) {
        console.error("Error creando detalle de servicio:", error);
        throw error;
    }
};

// ACTUALIZAR DETALLE DE SERVICIO
const actualizarDetalle = async (data, id_servicio, id_producto) => {
    try {
        const [updated] = await DetalleServicio.update(data, {
            where: { id_servicio, id_producto },
        });
        return updated; // número de filas afectadas
    } catch (error) {
        console.error("Error actualizando detalle de servicio:", error);
        throw error;
    }
};

// ELIMINAR DETALLE DE SERVICIO
const eliminarDetalle = async (id_servicio, id_producto) => {
    try {
        return await DetalleServicio.destroy({
            where: { id_servicio, id_producto },
        });
    } catch (error) {
        console.error("Error eliminando detalle de servicio:", error);
        throw error;
    }
};

module.exports = {
    getAllDetalles,
    getDetalleById,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle,
};
