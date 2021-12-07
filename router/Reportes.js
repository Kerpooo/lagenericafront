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
router.get("/", (req, res) => {
	res.render("templates/vistaReportes/listaClientes");
});

router.get("/", (req, res) => {
	res.render("templates/vistaReportes/listaVentas");
});


/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
router.post("/", urlencodedParser, async (req, res) => {
	const listarClientes = req.body.listarClientes;
	const listarVentas = req.body.listarVentas;


	//Para listar clientes
	if (listarClientes == "") {
		const getClientes = async () => {
			try {
				return await axios.get("http://localhost:8082/api/consultar");
			} catch (error) {
				console.error(error);
			}
		};

		const useClientes = async () => {
			const clientes = await getClientes();

			if (clientes.data) {
				console.log(clientes.data);		
			}

			res.render("./templates/vistaReportes/listaClientes",{clientes:(clientes.data)});
		};

		useClientes();

	}
		//Para listar ventas
		if (listarVentas == "") {
			const getVentas = async () => {
				try {
					return await axios.get("http://localhost:8081/api/listar");
				} catch (error) {
					console.error(error);
				}
			};
	
			const useVentas = async () => {
				const ventas = await getVentas();
	
				if (ventas.data) {
					console.log(ventas.data);
	
					
					res.render("./templates/vistaReportes/listaVentas",{ventas:(ventas.data)});
				}
			};
	
			useVentas();
		}
});
module.exports = router;
