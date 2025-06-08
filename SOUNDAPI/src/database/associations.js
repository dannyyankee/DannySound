const Usuario = require("./models/Usuario");
const Producto = require("./models/Producto");
const Servicio = require("./models/Servicio");
const DetalleServicio = require("./models/DetalleServicio");
const Resena = require("./models/Resena");

// Un usuario puede tener muchos productos
Usuario.hasMany(Producto, {
    foreignKey: "id_dueño",
    as: "productos"
});
Producto.belongsTo(Usuario, {
    foreignKey: "id_dueño",
    as: "dueño"
});

// 🔧 CORREGIDO: Un usuario puede tener muchos servicios (es quien alquila)
Usuario.hasMany(Servicio, {
    foreignKey: "dni_cliente", // 🔄 CAMBIADO
    as: "servicios"
});
Servicio.belongsTo(Usuario, {
    foreignKey: "dni_cliente", // 🔄 CAMBIADO
    as: "cliente"
});

// Un servicio puede tener muchos productos a través de DetalleServicio
Servicio.belongsToMany(Producto, {
    through: DetalleServicio,
    foreignKey: "id_servicio",
    otherKey: "id_producto",
    as: "productos"
});
Producto.belongsToMany(Servicio, {
    through: DetalleServicio,
    foreignKey: "id_producto",
    otherKey: "id_servicio",
    as: "servicios"
});

// Cada DetalleServicio pertenece a un producto y a un servicio
DetalleServicio.belongsTo(Producto, {
    foreignKey: "id_producto",
    as: "producto"
});
DetalleServicio.belongsTo(Servicio, {
    foreignKey: "id_servicio",
    as: "servicio"
});

// RELACIONES DIRECTAS PARA LOS INCLUDES
Servicio.hasMany(DetalleServicio, {
    foreignKey: "id_servicio",
    as: "detalles"
});
Producto.hasMany(DetalleServicio, {
    foreignKey: "id_producto",
    as: "detalles"
});
Servicio.hasMany(DetalleServicio, { foreignKey: 'id_servicio', as: 'DetalleServicios' });
DetalleServicio.belongsTo(Servicio, { foreignKey: 'id_servicio' });
Usuario.hasMany(Resena, {
    foreignKey: "dni_usuario",
    as: "resenas"
});
Resena.belongsTo(Usuario, {
    foreignKey: "dni_usuario",
    targetKey: "dni",
    as: "usuario"
});
module.exports = {
    Usuario,
    Producto,
    Servicio,
    DetalleServicio,
    Resena
};
