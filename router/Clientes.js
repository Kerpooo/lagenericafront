const express = require("express");
const router = express.Router();

//Cosas de clientes
const fs = require("fs");
const http = require("http");

// Genera la vista del menu de clientes
router.get("/", (req, res) => {
    res.render("templates/vistaClientes/clientes");
});

// Genera la vista de consultar

router.get("/consultar", (req, res) => {
    res.render("templates/vistaClientes/consultar");
});

// Genera la vista de crear
router.get("/crear", (req, res) => {
    res.render("templates/vistaClientes/crear");
});

// Genera la vista de actualizar
router.get("/actualizar", (req, res) => {
    res.render("templates/vistaClientes/actualizar");
});

// Genera la vista de eliminar
router.get("/eliminar", (req, res) => {
    res.render("templates/vistaClientes/eliminar");
});

module.exports = router;