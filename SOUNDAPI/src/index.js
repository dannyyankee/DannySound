// Inicializamos todas las variales
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors")

// Concectamos con la base de datos
const sequelize = require("./database/db");

// Importamos las asociaciones para que se generen en nuesta base de datos
require("./database/associations")

// Conversión a json indispensable para el funcionamiento 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuramos rutas
const apiroutes = require("./routes/apiRouter");

// Ruta para acceder a la base de datos
app.use("/api", apiroutes);

// Nos conectamos con el puerto.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor conectado al puerto " + PORT);
  sequelize
    .sync({ force: false }) // Cambiar a true para reiniciar la base de datos
    .then(() => console.log("Sincronizado con la base de datos dannysound"))
})