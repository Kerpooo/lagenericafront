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
			const getClientes = async () => {
				try {
					return await axios.get("http://localhost:8082/api/consultar");
				} catch (error) {
					console.error(error);
				}
			};

	
			const useVentas = async () => {
				const ventas = await getVentas();
				const clientes = await getClientes();

	
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
					const arrayNombres=[];
					let dataClientes=clientes.data;
					for (i=0;i<arrayCedulas.length;i++){
						let cedula=arrayCedulas[i];
						for(j=0;j<dataClientes.length;j++){
							if(cedula==dataClientes[j].cedula){
								arrayNombres.push(dataClientes[j].nombreCliente)
							}
						}
					}
					console.log(clientes.data);
					let resultado=[];
					for (i=0;i<arrayCedulas.length;i++){

						let obj= {
							cedula:arrayCedulas[i],
							nombre:arrayNombres[i],
							ventas:arrayVentas[i]
						}
						resultado.push(obj);
					}
					console.log(resultado);

					res.render("./templates/vistaReportes/listaVentas",{datos:(resultado)});
				}
			};
	
			useVentas();
		}
});
module.exports = router;
