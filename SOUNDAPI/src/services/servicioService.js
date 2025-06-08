const { Servicio, Producto, DetalleServicio, Usuario } = require("../database/associations");
const { generarFacturaPDF } = require("../services/pdfService");
const { enviarFacturaPorCorreo } = require("../services/emailService");
// Obtener todos los servicios con cliente y detalles (sin calcular nada extra)
const getAllServicios = async () => {
    try {
        return await Servicio.findAll({
            include: [
                {
                    model: Usuario,
                    as: "cliente",
                    attributes: ["dni", "nombre", "correo"]
                },
                {
                    model: DetalleServicio,
                    as: "detalles",
                    include: {
                        model: Producto,
                        as: "producto",
                        attributes: ["id_producto", "nombre", "precio_dia"]
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error obteniendo servicios:", error);
        throw error;
    }
};

// Crear servicio con productos, cantidad y precio_total calculados
// Ahora sin dni_cliente en parámetros, porque se tomará en controlador desde req.user
const crearServicioConProductos = async ({ dni_cliente, fecha_inicio, fecha_fin, productos }) => {
    try {
        // Crear el servicio
        const servicio = await Servicio.create({ dni_cliente, fecha_inicio, fecha_fin });

        // Calcular días (mínimo 1)
        const fechaInicio = new Date(fecha_inicio);
        const fechaFin = new Date(fecha_fin);
        let dias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
        if (dias < 1) dias = 1;

        // Preparar detalles con cantidad y precio total
        const detalles = [];
        for (const p of productos) {
            const producto = await Producto.findByPk(p.id_producto);
            if (!producto) {
                throw new Error("Producto no encontrado: " + p.id_producto);
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

        // Guardar detalles en lote
        await DetalleServicio.bulkCreate(detalles);

        // Obtener el cliente completo con correo
        const cliente = await Usuario.findOne({ where: { dni: dni_cliente } });

        if (cliente && cliente.correo) {
            // Obtener el servicio completo con detalles
            const servicioCompleto = await Servicio.findByPk(servicio.id_servicio, {
                include: [
                    {
                        model: Usuario,
                        as: "cliente",
                        attributes: ["dni", "nombre", "correo"]
                    },
                    {
                        model: DetalleServicio,
                        as: "detalles",
                        include: {
                            model: Producto,
                            as: "producto",
                            attributes: ["id_producto", "nombre", "precio_dia"]
                        }
                    }
                ]
            });

            // Generar factura
            const pathPDF = await generarFacturaPDF(servicioCompleto, cliente);

            // Enviar por correo al cliente
            await enviarFacturaPorCorreo(cliente.correo, cliente.nombre, pathPDF);
        }

        return servicio;
    } catch (error) {
        console.error("Error creando servicio con productos:", error);
        throw error;
    }
};

// Obtener servicio por ID con cliente y detalles
const getServicioById = async (id) => {
    try {
        return await Servicio.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: "cliente",
                    attributes: ["dni", "nombre", "correo"]
                },
                {
                    model: DetalleServicio,
                    as: "detalles",
                    include: {
                        model: Producto,
                        as: "producto"
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error obteniendo servicio:", error);
        throw error;
    }
};

// Actualizar servicio
const actualizarServicio = async (data, id) => {
    try {
        const [updated] = await Servicio.update(data, { where: { id_servicio: id } });
        return updated;
    } catch (error) {
        console.error("Error actualizando servicio:", error);
        throw error;
    }
};

// Eliminar servicio
const eliminarServicio = async (id) => {
    try {
        return await Servicio.destroy({ where: { id_servicio: id } });
    } catch (error) {
        console.error("Error eliminando servicio:", error);
        throw error;
    }
};

// Obtener servicios de un cliente
const getServiciosDeCliente = async (dni_cliente) => {
    try {
        return await Servicio.findAll({
            where: { dni_cliente },
            include: [
                {
                    model: Usuario,
                    as: "cliente",
                    attributes: ["dni", "nombre", "correo"]
                },
                {
                    model: DetalleServicio,
                    as: "detalles",
                    include: {
                        model: Producto,
                        as: "producto"
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error obteniendo servicios del cliente:", error);
        throw error;
    }
};

module.exports = {
    getAllServicios,
    getServicioById,
    crearServicioConProductos,
    actualizarServicio,
    getServiciosDeCliente,
    eliminarServicio,
};
