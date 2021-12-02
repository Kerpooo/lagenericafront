const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const http = require("http");
const app = express();

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Cosas de clientes

router.get("/", (req, res) => {
	res.render("templates/vistaClientes/clientes");
});

// Genera la vista de consultar

router.get("/consultar", (req, res) => {
	res.render("templates/vistaClientes/consultar");
});

// Genera la vista de crear
router.get("/crear", (req, res) => {
	res.render("templates/vistaClientes/crear");
});

// Genera la vista de actualizar
router.get("/actualizar", (req, res) => {
	res.render("templates/vistaClientes/actualizar");
});

//RequestBack
function backServerReq(options, data) {
	req = http.request(options, (res) => {
		//status code of the request sent
		console.log("statusCode: ", res.statusCode);
		let result = "";
		// A chunk of data has been recieved. Append it with the previously retrieved chunk of data
		res.on("data", (chunk) => {
			result += chunk;
		});
		//The whole response has been received. Display it into the console.
		res.on("end", () => {
			console.log("Result is: " + result);
		});
	});
	//error if any problem with the request
	req.on("error", (err) => {
		console.log("Error: " + err.message);
	});
	//write data to request body
	req.write(data);
	//to signify the end of the request - even if there is no data being written to the request body.
	req.end();
}

router.post("/crear", urlencodedParser, async (req, res) => {
	const nombreCompleto = req.body.nombreCompleto;
	const cedula = req.body.cedula;
	const correo = req.body.correo;
	const telefono = req.body.telefono;
	const direccion = req.body.direccion;

	const data = JSON.stringify({
		cedulaCliente: cedula,
		direccionCliente: direccion,
		emailCliente: correo,
		nombreCliente: nombreCompleto,
		telefonoCliente: telefono,
	});

	//DEBUGGER
	console.log(req.body);

	//Para Crear Cliente

	const options = {
		host: "localhost",
		port: 8082,
		path: "/api/crear",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": data.length,
		},
	};

	//Alerta Cliente Creado Correcto
	res.render("./templates/vistaClientes/crear", {
		alerta: "Cliente Creado",
		colorAlerta: "success",
	});
});

router.post("/", urlencodedParser, async (req, res) => {
	const cedula = req.body.cedula;
	const eliminar = req.body.eliminar;
	const buscar = req.body.buscar;

	const data = JSON.stringify({
		cedulaCliente: cedula,
	});

	//Para consulta por cedula
	if (buscar == "") {
		console.log(req.body);

		const options = {
			host: "localhost",
			port: 8082,
			path: "/api/consultar/" + cedula,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": data.length,
			},
		};

		let resultado = backServerReq(options, data);

		console.log("DEbug" + resultado);

		res.render("templates/vistaClientes/consultar", {});
	}

	//Eliminar

	if (eliminar == "") {
		const options = {
			host: "localhost",
			port: 8082,
			path: "/api/eliminar/" + cedula,
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": data.length,
			},
		};

		backServerReq(options, data);

		//Alerta Consulta
		res.render("./templates/vistaClientes/clientes", {
			alerta: "Cliente Eliminado",
			colorAlerta: "danger",
		});
	}
});
module.exports = router;
