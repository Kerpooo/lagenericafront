const express = require("express");
const path = require("path");
const Papa = require("papaparse");
const multer = require("multer");
const fs = require("fs");
const http = require("http");
const app = express();

//Para usar router
const router = express.Router();

//Para subir archivos
const upload = multer({ dest: "./" });

//Permite leer archivos de carpeta public
app.use(express.static(path.join(__dirname, "public")));


//Motor de Plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Rutas Web
app.use('/', require('./router/RutasWeb'));
app.use('/productos', require('./router/Productos'));


//PAGINA ERROR
app.use((req, res, next) => {
    res.status(404).render("404", {
        titulo: "404",
        descripcion: "Título del sitio web"
    })  
})

//Inicia la escucha en el puerto 3000
app.listen(3000, () => {
	console.log("Servidor Inicia puerto 3000");
});
