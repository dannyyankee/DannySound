// services/resenaService.js
const Resena = require("../database/models/Resena");
const Usuario = require("../database/models/Usuario");

const crearResena = async ({ contenido, estrellas, anonimo, dni_usuario }) => {
    return await Resena.create({ contenido, estrellas, anonimo, dni_usuario });
};
  

const obtenerResenas = async () => {
    return await Resena.findAll({
        order: [['fecha', 'DESC']],
        include: {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre']
        }
    });
};
// controllers/resenaController.js
exports.obtenerResenas = async (req, res) => {
    try {
        const { estrellas } = req.query;

        const where = estrellas ? { estrellas } : {};

        const resenas = await Resena.findAll({
            where,
            include: [{ model: Usuario, attributes: ["nombre"] }],
            order: [["fecha", "DESC"]],
        });

        res.json(resenas);
    } catch (err) {
        console.error("Error al obtener reseñas:", err);
        res.status(500).json({ error: "Error al obtener reseñas" });
    }
};

module.exports = {
    crearResena,
    obtenerResenas
};
