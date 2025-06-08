const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Servicio extends Model { }

Servicio.init({
  id_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni_cliente: {
    type: DataTypes.STRING,
    references: {
      model: "usuario",
      key: "dni"
    }
  },
  fecha_inicio: DataTypes.DATEONLY,
  fecha_fin: DataTypes.DATEONLY,
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptado', 'finalizado'),
    defaultValue: 'pendiente'
  }
}, {
  sequelize,
  modelName: "servicio",
  tableName: "servicio",
  timestamps: false
});

module.exports = Servicio;
