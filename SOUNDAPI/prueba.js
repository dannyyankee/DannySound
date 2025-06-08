
const { Sequelize } = require("sequelize");
const db = require("./src/database/db"); // Ajusta si tu archivo de conexión tiene otro nombre
const Producto = require("./src/database/models/Producto"); // Ajusta según tu estructura

(async () => {
    try {
        await db.authenticate(); // Asegura que hay conexión
        const productos = await Producto.findAll({ raw: true });
        console.log("Productos existentes:", productos);
    } catch (error) {
        console.error("Error al consultar productos:", error);
    } finally {
        await db.close();
    }
})();
