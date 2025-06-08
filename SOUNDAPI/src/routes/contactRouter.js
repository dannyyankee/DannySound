const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

router.post('/send-contact-email', async (req, res) => {
    const { nombre, apellido, email, asunto, mensaje } = req.body;
    if (!email || !mensaje) {
        return res.status(400).json({ mensaje: 'Email y mensaje son obligatorios' });
    }
    try {
        await sendContactEmail({ nombre, apellido, email, asunto, mensaje });
        res.json({ mensaje: 'Mensaje de contacto enviado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al enviar el mensaje' });
    }
});

module.exports = router;
