const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render("productos")
})

router.get('/crear', (req,res) => {
    res.render("crear")
})



module.exports = router;