// models/Resena.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");

class Resena extends Model { }

Resena.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    estrellas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    anonimo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    dni_usuario: {
        type: DataTypes.STRING(20),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "Resena",
    tableName: "resena",
    timestamps: false,
});
module.exports = Resena;
