const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'danielmartinrol2001@gmail.com',
        pass: 'tcrqwoxmhvittabz'
    },
});

async function enviarCorreo(destinatario, asunto, texto) {
    const mailOptions = {
        from: '"DannySound" <danielmartinrol2001@gmail.com>',
        to: destinatario,
        subject: asunto,
        text: texto,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return true;
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return false;
    }
}

async function sendContactEmail({ nombre, apellido, email, asunto, mensaje }) {
    const texto = `
Nuevo mensaje de contacto desde DannySound:

Nombre: ${nombre || ''}
Apellido: ${apellido || ''}
Correo: ${email}
Asunto: ${asunto || '(sin asunto)'}
Mensaje:
${mensaje}
`;

    return await enviarCorreo(
        'danielmartinrol2001@gmail.com',
        `Nuevo mensaje de contacto: ${asunto || 'sin asunto'}`,
        texto
    );
}

async function sendPasswordRecoveryEmailTest({ nombre, apellido, nuevaClave, correo }) {
    const texto = `
Hola ${nombre} ${apellido},

Has solicitado recuperar tu contraseña. Tu nueva contraseña temporal es:

${nuevaClave}

Por favor, cambia esta contraseña lo antes posible después de iniciar sesión.

Saludos,
Equipo DannySound
`;

    return await enviarCorreo(
        correo,
        'Recuperación de contraseña - DannySound',
        texto
    );
}
const enviarFacturaPorCorreo = async (correo, nombreCliente, pathPDF) => {
    await transporter.sendMail({
        from: '"Danny Yankee Sound" <danielmartinrol2001@gmail.com>',
        to: correo,
        subject: "Tu factura de servicio",
        text: `Hola ${nombreCliente},\n\nAdjuntamos la factura de tu servicio.\n\nGracias por confiar en nosotros.`,
        attachments: [
            {
                filename: "factura_servicio.pdf",
                path: pathPDF
            }
        ]
    });
};

module.exports = {
    enviarCorreo, sendContactEmail, enviarFacturaPorCorreo, sendPasswordRecoveryEmailTest
};
