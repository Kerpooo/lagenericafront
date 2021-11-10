const express = require("express");
const router = express.Router();
//Signin
router.get("/inicio", (req, res) => {
	res.render("templates/inicio", { titulo: "Home" });
});
router.get("/", (req, res) => {
	res.render("index", { titulo: "Home" });
});

module.exports = router;
