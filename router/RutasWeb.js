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

	console.log(messages);
});
let username = "admininicial";
let password = 1234;

router.post("/", urlencodedParser, async (req, res) => {
	const nombre = req.body.usuario;
	const contraseña = req.body.contraseña;
	let xd = __dirname;
	console.log(nombre, contraseña, xd);

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
