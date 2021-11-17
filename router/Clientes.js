const express = require("express");
const router = express.Router();

//Cosas de clientes
const fs = require("fs");
const http = require("http");

router.get("/", (req, res) => {
    res.render("templates/vistaClientes/clientes");
});

router.get("/crear", (req, res) => {
    res.render("templates/vistaClientes/crear");
});

module.exports = router;