const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/inicio", (req, res) => {
	res.render("templates/inicio", { titulo: "Home" });
});

//Signin
router.get("/", (req, res) => {
	res.render("index", {
		loacalizacion_sucursal: "Bogotá",
	});

});
let username = "admininicial";
let password = "admin123456";

router.post("/", urlencodedParser, async (req, res) => {
	const nombre = req.body.usuario;
	const contraseña = req.body.contraseña;
	console.log(nombre, contraseña);

	if (nombre == username && contraseña == password) {
		res.redirect("inicio");
	} else {
		res.render("index", {
			loacalizacion_sucursal: "Bogotá",
			alerta: "Usuario o contraseña errados, intente de nuevo",
		});
	}
});

module.exports = router;
