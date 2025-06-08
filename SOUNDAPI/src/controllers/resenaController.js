// controllers/resenaController.js
const resenaService = require("../services/resenaService");

// Crear reseña: extrae todos los campos del body y usa el servicio para crear
const crearResena = async (req, res) => {
    try {
        const { contenido, estrellas, anonimo } = req.body;
        const dni_usuario = req.user?.dni;

        if (!contenido || !estrellas || estrellas < 1 || estrellas > 5) {
            return res.status(400).json({ error: "Contenido y estrellas válidas requeridos" });
        }
        if (!dni_usuario) {
            return res.status(400).json({ error: "Usuario no autenticado" });
        }

        const nuevaResena = await resenaService.crearResena({
            contenido,
            estrellas,
            anonimo: !!anonimo,
            dni_usuario,
        });

        res.status(201).json(nuevaResena);
    } catch (err) {
        console.error("Error al crear reseña:", err);
        res.status(500).json({ error: "Error al crear reseña" });
    }
};

// Obtener todas las reseñas
const obtenerResenas = async (req, res) => {
    try {
        const resenas = await resenaService.obtenerResenas();
        res.json(resenas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener reseñas" });
    }
};

module.exports = {
    crearResena,
    obtenerResenas
};
