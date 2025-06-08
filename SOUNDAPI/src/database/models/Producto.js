const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Producto extends Model { }

Producto.init({
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  precio_dia: DataTypes.DECIMAL(10, 2),
  disponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  id_dueño: {
    type: DataTypes.STRING,
    references: {
      model: "usuario",
      key: "dni"
    }
  }
}, {
  sequelize,
  modelName: "producto",
  tableName: "producto",
  timestamps: false
});

module.exports = Producto;
