const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Usuario extends Model { }

Usuario.init({
  dni: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  nombre: DataTypes.STRING,
  apellidos: DataTypes.STRING,
  correo: {
    type: DataTypes.STRING,
    unique: true
  },
  clave: DataTypes.STRING,
  rol: DataTypes.ENUM('cliente', 'dueño')
}, {
  sequelize,
  modelName: "usuario",
  tableName: "usuario",
  timestamps: false
});

module.exports = Usuario;
