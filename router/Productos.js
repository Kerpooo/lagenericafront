const express = require("express");
const router = express.Router();

//Librerias de productos
const Papa = require("papaparse");
const multer = require("multer");
const fs = require("fs");
const http = require("http");

//Para subir archivos
const upload = multer({ dest: "./" });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Estructura columnas del archivo
let estructura = [
	"codigoProducto",
	"nombreProducto",
	"nitProveedor",
	"precioCompra",
	"ivaCompra",
	"precioVenta",
];



//Hace el request al server
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
//Verifica que un array sea igual al otro y devuelve false en caso de que no y true en caso de que si
function itsSame(array_base, array_in) {
	for (let i = 0; i < array_base.length; i++) {
		const element = array_base[i];
		if (element != array_in[i]) {
			return false;
		}
	}
	return true;
}

//Verifica si el dato que recibe es un string vacio
function itsEmpty(data) {
	if (data == "") {
		return true;
	}
	return false;
}

//Funcion para comparar estructura de datos
function validarStructura(estructura, input) {
	let failEstructura;
	if (estructura.length == input.length) {
	} else {
		return (failEstructura = true);
	}

	if (itsSame(estructura, input)) {
		failEstructura = false;
		return failEstructura;
	} else {
		failEstructura = true;
		return failEstructura;
	}
}

/*Verifica que el archivo ingresado tenga los tipos de datos que se requieren
es decir todos numeros menos el nombre de producto*/
function verify(array) {
	for (let i = 1; i < array.length; i++) {
		const producto = array[i];

		let arrayTipoDato = [0, 1, 0, 0, 0, 0];
		let arrayDatoVacio = [0, 0, 0, 0, 0, 0];

		let tipoDatoEntrada = producto.map(isNaN);
		let inputDatoVacio = producto.map(itsEmpty);

		if (
			itsSame(arrayTipoDato, tipoDatoEntrada) == false ||
			itsSame(arrayDatoVacio, inputDatoVacio) == false
		) {
			return false;
		}
	}
	return true;
}

//Toma un array lo transforma a objeto y lo envia al back
function uploadObj(array) {
	
	for (let i = 1; i < array.length; i++) {
		const producto = array[i];

		objData = JSON.stringify({
			codigoProducto: parseInt(producto[0]),
			nombreProducto: producto[1],
			nitProveedor: parseInt(producto[2]),
			precioCompra: parseInt(producto[3]),
			ivaCompra: parseInt(producto[4]),
			precioVenta: parseInt(producto[5]),
		});
//Se usa para enviar los datos al back por http request
		const options = {
		host: "localhost",
		port: 8083,
		path: "/api/crear",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": objData.length,
			},
		};
		backServerReq(options, objData);
	}
}

//Variable para el fallo de extension de archivo
let fail = false;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Genera la vista del menu de productos
router.get("/", (req, res) => {
	res.render("templates/vistaProductos/productos");
});

// Genera la vista de crear
router.get("/crear", (req, res) => {
	res.render("templates/vistaProductos/crear");
});

router.post("/crear", upload.single("file_csv"), (req, res, next) => {
	//Se guarda el archivo
	const file = req.file;
	if (!file) {
		res.render("./templates/vistaProductos/crear", {
			alerta: "Error: no se seleccionó archivo para cargar",
			colorAlerta: "danger",
		});
	}

	//Archivo no es CSV
	if (!file.originalname.endsWith(".csv")) {
		res.render("./templates/vistaProductos/crear", {
			alerta: "Error: formato de archivo inválido",
			colorAlerta: "danger",
		});

		fail = true;
	}

	//Nombre del archivo
	let file_name = file.filename;

	function leerArchivo(f) {
		csv = fs.createReadStream(f);

		Papa.parse(csv, {
			delimiter: "",
			complete: function (results) {
				// Columnas del archvio
				let header = results.data[0];

				let resultValEstructura = validarStructura(estructura, header);
				// Contenido del archivo
				let array = results.data;

				if (resultValEstructura) {
					res.render("./templates/vistaProductos/crear", {
						alerta: "Error: Fallo en el nombre de las columnas",
						colorAlerta: "danger",
					});
				}

				//Si todo esta validado se ejecuta esto
				if (!resultValEstructura) {
					//Si hay un fallo en el tipo de dato o hay un dato vacion,no se envian los datos
					if (!verify(array)) {
						res.render("./templates/vistaProductos/crear", {
							alerta: "Error: datos leídos inválidos",
							colorAlerta: "danger",
						});
					}

					uploadObj(array);
				}

				res.render("./templates/vistaProductos/crear", {
					alerta: "Archivo Cargado Exitosamente",
					colorAlerta: "success",
				});
			},
		});
	}

	//Elimina el archivo que se creo para obtener los datos
	function eliminarArchvio(file_name) {
		try {
			fs.unlinkSync(file_name);
			console.log("Archivo Eliminado");
		} catch (err) {
			console.error("Error eliminando el archivo", err);
		}
	}

	//Si hay un error no se lee el archivo
	if (fail == false) {
		leerArchivo(file_name);
	}

	eliminarArchvio(file_name);
});

module.exports = router;