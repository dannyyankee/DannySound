const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class DetalleServicio extends Model { }

DetalleServicio.init({
  id_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  precio_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  sequelize,
  modelName: "detalle_servicio",
  tableName: "detalle_servicio",
  timestamps: false
});

module.exports = DetalleServicio;
