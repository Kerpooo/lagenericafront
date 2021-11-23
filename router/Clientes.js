const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

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

//Cosas de clientes
const http = require("http");

router.get("/", (req, res) => {
	res.render("templates/vistaClientes/clientes");
});

router.get("/crear", (req, res) => {
	res.render("templates/vistaClientes/crear");
});

router.post("/", urlencodedParser, async (req, res) => {
	const nombreCompleto = req.body.nombreCompleto;
	const cedula = req.body.cedula;
	const correo = req.body.correo;
	const telefono = req.body.telefono;
	const direccion = req.body.direccion;
	const eliminar = req.body.eliminar;
	const buscar = req.body.buscar;
	const crear = req.body.crear;

	const data = JSON.stringify({
		cedula_cliente: cedula,
		direccion_cliente: direccion,
		email_cliente: correo,
		nombre_cliente: nombreCompleto,
		telefono_cliente: telefono,
	});

	//DEBUGGER
	console.log(req.body);
	console.log(eliminar == "");

	//Para consulta por cedula
	if (buscar == "") {
		const options = {
			host: "localhost",
			port: 8082,
			path: "/api/clientes/consultar",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": data.length,
			},
		};

		backServerReq(options, data);

		//Alerta Consulta
		res.render("./templates/vistaClientes/clientes", {
			alerta: "Consulta",
			colorAlerta: "warning",
		});
	}

	//Eliminar

	if (eliminar == "") {
		const options = {
			host: "localhost",
			port: 8082,
			path: "/api/clientes/eliminar",
			method: "POST",
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

	//Para Crear Cliente
	if (crear == "") {
		const options = {
			host: "localhost",
			port: 8082,
			path: "/api/clientes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": data.length,
			},
		};

		backServerReq(options, data);

		//Alerta Cliente Creado Correcto
		res.render("./templates/vistaClientes/clientes", {
			alerta: "Cliente Creado",
			colorAlerta: "success",
		});
	}
});

module.exports = router;
