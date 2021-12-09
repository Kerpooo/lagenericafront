const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");

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
	const getProductos = async () => {
		try {
			return await axios.get("http://localhost:8083/api/consultar");
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
	const getVentas = async () => {
		try {
			return await axios.get("http://localhost:8081/api/listar");
		} catch (error) {
			console.error(error);
		}
	};

	const useVentas = async () => {
		const productos = await getProductos();
		const clientes = await getClientes();
		const ventas = await getVentas();


		console.log(ventas.data);

		res.render("templates/vistaVentas/ventas", {
			productos: productos.data,
			clientes: clientes.data,
			ventas: ventas.data,
		});
	};

	useVentas();
});

router.post("/", urlencodedParser, async (req, res) => {
	const cedulaCliente = req.body.cedulaCliente;
	const consecutivo = req.body.consecutivo;

	//codigo producto
	const cp1 = req.body.codigoProducto1;
	const cp2 = req.body.codigoProducto2;
	const cp3 = req.body.codigoProducto3;

	//valor unitario
	const vunit1 = req.body.valorUnit1;
	const vunit2 = req.body.valorUnit2;
	const vunit3 = req.body.valorUnit3;

	//cantidad
	const cantP1 = req.body.cantidadProducto1;
	const cantP2 = req.body.cantidadProducto2;
	const cantP3 = req.body.cantidadProducto3;

	//valor total de cada producto
	const valorVenta1 = req.body.valorVenta1;
	const valorVenta2 = req.body.valorVenta2;
	const valorVenta3 = req.body.valorVenta3;

	const subVenta = req.body.subtotalVenta;
	const iva = req.body.iva;
	const totalVenta = req.body.totalVenta;

	const data = JSON.stringify({
		codigoVenta: consecutivo,
		cedulaCliente: cedulaCliente,
		detalleVenta: [
			{
				cantidadProducto: cantP1,
				codigoProducto: cp1,
				valorTotal: vunit1,
				valorVenta: valorVenta1,
				valorIVA: iva,
			},
			{
				cantidadProducto: cantP2,
				codigoProducto: cp2,
				valorTotal: vunit2,
				valorVenta: valorVenta2,
				valorIVA: iva,
			},
			{
				cantidadProducto: cantP3,
				codigoProducto: cp3,
				valorTotal: vunit3,
				valorVenta: valorVenta3,
				valorIVA: iva,
			},
		],
		ivaVenta: iva,
		subtotalVenta: subVenta,
		totalVenta: totalVenta,
	});


	console.log(data);

	const options = {
		host: "localhost",
		port: 8081,
		path: "/api/crear",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": data.length,
		},
	};

	backServerReq(options, data);

	//Alerta Cliente Creado Correcto
	res.render("./templates/inicio", {
		alerta: "Venta Confirmada",
		colorAlerta: "success",
	});
});

module.exports = router;
