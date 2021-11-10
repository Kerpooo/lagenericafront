const express = require("express");
const router = express.Router();

//Cosas de clientes
const Papa = require("papaparse");
const multer = require("multer");
const fs = require("fs");
const http = require("http");

//Para subir archivos
const upload = multer({ dest: "./" });

router.get("/", (req, res) => {
    res.render("templates/vistaClientes/clientes");
});

router.get("/crear", (req, res) => {
    res.render("templates/vistaClientes/crear");
});

module.exports = router;