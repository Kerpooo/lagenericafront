//Express
const express = require("express");
const app = express();
//Permite leer archivos de carpeta public
app.use(express.static(__dirname + "/public"));

//Motor de Plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Rutas Web
app.use("/", require("./router/RutasWeb"));
app.use("/productos", require("./router/Productos"));
app.use("/clientes", require("./router/Clientes"));
app.use("/ventas", require("./router/Ventas"));
app.use("/reportes", require("./router/Reportes"));


//PAGINA ERROR
app.use((req, res, next) => {
	res.status(404).render("404", {});
});

//Inicia la escucha en el puerto 3000
app.listen(3000, () => {
	console.log("Servidor Inicia puerto 3000");
});
