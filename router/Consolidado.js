const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const http = require("http");
const axios = require("axios");
const app = express();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Cosas de clientes
router.get("/", (req, res) => {
	res.render("templates/vistaConsolidado/consultar");
});


router.get("/", (req, res) => {
	res.render("templates/vistaConsolidado/resconsolidado");
});




/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
/////////////////////////////////////////////Metodos HTTP/////////////////////////////////////////
router.post("/", urlencodedParser, async (req, res) => {
	
	const consultar = req.body.consultar;

	//Para listar ventas
	if (consultar == "") {
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
				let dataVentas=ventas.data;
				const cedulas = dataVentas.map((x) => x.cedulaCliente);
				// He cambiado el nombre de la variable nombre a arrayNombres, mucho más indicativo de su contenido!
				const arrayCedulas= [...new Set(cedulas)];
				// Se declara un arrayVentas vacío, aquí almacenaremos las ventas de cada uno
				const arrayVentas = [];
				arrayCedulas.forEach((ced) => {
				const filtro = dataVentas.filter((x) => x.cedulaCliente == ced);
				const ventas = filtro.reduce((act, valor) => act + valor.totalVenta, 0);
				// Hasta aquí es lo mismo que tenías tu!
				// Simplemente en vez de imprimirlo en consola, lo meto al array de ventas
				arrayVentas.push(ventas);
				});
				
				console.log(arrayVentas);
				let ventastotal=0;
				for (i=0;i<arrayVentas.length;i++){
					ventastotal=ventastotal+arrayVentas[i];
				}
				console.log(ventastotal);

				res.render("./templates/vistaConsolidado/resconsolidado",{ventastotal});
			}
		};

		useVentas();
	}
});
module.exports = router;
