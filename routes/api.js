const express = require('express');
const router = express.Router();

const Productos = require("./productos");
// const Usuarios = require("./usuarios");

// Registrar rutas
router.use("/producto", Productos);
// router.use("/usuario", Usuarios);

module.exports = router;
