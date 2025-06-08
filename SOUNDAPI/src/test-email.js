const nodemailer = require('nodemailer');

async function testSend() {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'danielmartinrol2001@gmail.com',   // tu email aquí
            pass: 'tcrqwoxmhvittabz'                  // tu contraseña de aplicación aquí
        }
    });

    let info = await transporter.sendMail({
        from: `"Prueba" <danielmartinrol2001@gmail.com>`,
        to: 'danielmartinrol2001@gmail.com',          // mismo email o a quien quieras enviar
        subject: "Prueba Nodemailer",
        text: "Este es un email de prueba enviado con Nodemailer sin usar .env"
    });

    console.log("Mensaje enviado:", info.messageId);
}

testSend().catch(console.error);
