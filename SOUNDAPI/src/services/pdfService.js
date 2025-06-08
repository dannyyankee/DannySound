const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Servicio, Usuario, DetalleServicio, Producto } = require("../database/associations");

const generarFacturaServicio = async (id_servicio, metodo_pago = "No especificado") => {
    const servicio = await Servicio.findByPk(id_servicio, {
        include: [
            { model: Usuario, as: "cliente" },
            {
                model: DetalleServicio,
                as: "detalles",
                include: { model: Producto, as: "producto" },
            },
        ],
    });

    if (!servicio) throw new Error("Servicio no encontrado");

    // Asegura que la carpeta 'facturas' existe
    const carpetaFacturas = path.join(__dirname, "..", "facturas");
    if (!fs.existsSync(carpetaFacturas)) {
        fs.mkdirSync(carpetaFacturas, { recursive: true });
    }

    const nombreArchivo = `factura_servicio_${id_servicio}.pdf`;
    const ruta = path.join(carpetaFacturas, nombreArchivo);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(ruta);

        doc.pipe(stream);

        // Contenido de la factura
        doc.fontSize(20).text("FACTURA - DANNY YANKEE SOUND", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Cliente: ${servicio.cliente.nombre} (${servicio.cliente.dni})`);
        doc.text(`Fechas: ${servicio.fecha_inicio} - ${servicio.fecha_fin}`);
        doc.text(`Método de pago: ${metodo_pago}`);
        doc.moveDown();

        doc.fontSize(14).text("Productos:", { underline: true });
        let total = 0;
        servicio.detalles.forEach(det => {
            const nombre = det.producto?.nombre || "Producto desconocido";
            const cantidad = det.cantidad;
            const precio = parseFloat(det.precio_total);
            total += precio;
            doc.text(`- ${nombre} x${cantidad} ........... ${precio.toFixed(2)} €`);
        });

        doc.moveDown();
        doc.fontSize(14).text(`TOTAL: ${total.toFixed(2)} €`, { align: "right" });

        doc.end();

        // Espera a que termine de escribir el archivo
        stream.on("finish", () => resolve(ruta));
        stream.on("error", (err) => reject(err));
    });
};

module.exports = {
    generarFacturaServicio,
};
