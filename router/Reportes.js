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

router.get("/", (req, res) => {
	res.render("templates/vistaReportes/reportes");
});
router.get("/listaClientes", (req, res) => {
	res.render("templates/vistaReportes/listaClientes");
});

router.get("/listaVentas", (req, res) => {
	res.render("templates/vistaReportes/listaVentas");
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

/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
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

			if (cliente.data) {
				console.log(cliente.data);

				
				res.render("./templates/vistaReportes/listaClientes", {
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
});
module.exports = router;
