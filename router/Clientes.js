const express = require("express");
const router = express.Router();

//Cosas de clientes
const fs = require("fs");
const http = require("http");

router.get("/", (req, res) => {
    res.render("templates/vistaClientes/clientes");
});

module.exports = router;