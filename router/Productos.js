const express = require("express");
const router = express.Router();

//Cosas de productos
const Papa = require("papaparse");
const multer = require("multer");
const fs = require("fs");
const http = require("http");

//Para subir archivos
const upload = multer({ dest: "./" });

router.get("/", (req, res) => {
    res.render("productos");
});

router.get("/crear", (req, res) => {
    res.render("crear");
});

module.exports = router;