const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const http = require("http");
const axios = require("axios");
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
	let estado;
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
		
		if(res.statusCode===204){
			estado=res.statusCode;
			}
	});

	//error if any problem with the request
	req.on("error", (err) => {
		console.log("Error: " + err.message);
	});
	//write data to request body
	req.write(data);
	//to signify the end of the request - even if there is no data being written to the request body.
	req.end();
	return(estado);
}

/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
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

	backServerReq(options, data);

	//Alerta Cliente Creado Correcto
	res.render("./templates/vistaClientes/clientes", {
		alerta: "Cliente Creado",
		colorAlerta: "success",
	});
});

router.post("/", urlencodedParser, async (req, res) => {
	const cedula = req.body.cedula;
	const eliminar = req.body.eliminar;
	const buscar = req.body.buscar;
	const actualizar = req.body.actualizar;
	const guardar = req.body.guardar;

	const data = JSON.stringify({
		cedulaCliente: cedula,
	});

	//Para consulta por cedula
	if (buscar == "") {
		const getCliente = async () => {
			try {
				return await axios.get("http://localhost:8082/api/consultar/" + cedula);
			} catch (error) {
				console.error(error);
			}
		};

		const useCliente = async () => {
			const cliente = await getCliente();

			console.log(cliente);
			if(cliente === undefined){
				res.render("./templates/vistaClientes/clientes",{
					alerta: "Cliente Inexistente",
					colorAlerta: "danger",
				})
			}else{
				console.log(cliente.data);
	
				res.render("./templates/vistaClientes/consultar", {
					nombre: cliente.data.nombreCliente,
					direccion: cliente.data.direccionCliente,
					telefono: cliente.data.telefonoCliente,
					email: cliente.data.emailCliente,
					cedula: cliente.data.cedula,
					});
			}
			
		};

		useCliente();
	}
	//Para consulta de actualizacion
	if (actualizar == "") {
		const getCliente = async () => {
			try {
				return await axios.get("http://localhost:8082/api/consultar/" + cedula);
			} catch (error) {
				console.error(error);
			}
		};

		const useCliente = async () => {
			const cliente = await getCliente();

			if(cliente === undefined){
				res.render("./templates/vistaClientes/clientes",{
					alerta: "Cliente Inexistente",
					colorAlerta: "danger",
				})
			}else{
				res.render("./templates/vistaClientes/actualizar", {
					nombre: cliente.data.nombreCliente,
					direccion: cliente.data.direccionCliente,
					telefono: cliente.data.telefonoCliente,
					email: cliente.data.emailCliente,
					cedula: cliente.data.cedula,
				});
			}
		};

		useCliente();
	}

	if (guardar == "") {

		const nombre = req.body.nombre;
		const cedula =req.body.cedula;
		const correo = req.body.correo;
		const telefono = req.body.telefono;
		const direccion = req.body.direccion;

		const data = JSON.stringify({
			cedulaCliente: cedula,
			direccionCliente: direccion,
			emailCliente: correo,
			nombreCliente: nombre,
			telefonoCliente: telefono,
		});

	//DEBUGGER
	console.log(data);


	//Para actualizar Cliente

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

	backServerReq(options, data);

	//Alerta Cliente Creado Correcto
	res.render("./templates/vistaClientes/clientes", {
		alerta: "Datos del Cliente Actualizados",
		colorAlerta: "success",
	});
	}

	//Eliminar

	if (eliminar == "") {
		const getCliente = async () => {
			try {
				return await axios.get("http://localhost:8082/api/consultar/" + cedula);
			} catch (error) {
				console.error(error);
			}
		};

		const useCliente = async () => {
			const cliente = await getCliente();

			console.log(cliente)

			if(cliente === undefined){
				res.render("./templates/vistaClientes/clientes",{
					alerta: "Cliente Inexistente",
					colorAlerta: "danger",
				})
			}else{
				const getCliente = async () => {
				try {
					return await axios.delete("http://localhost:8082/api/eliminar/" + cedula);
				} catch (error) {
					console.error(error);
				}
			};
				const cliente = await getCliente();
				console.log(cliente);

				if(cliente.status===204){
					res.render("./templates/vistaClientes/clientes", {
						alerta: "Cliente Eliminado",
						colorAlerta: "danger",
						});
				}
				
			}
			
		};

		useCliente();
	}
});
module.exports = router;
