const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productos");
// const { verifyToken } = require("../middlewares/authMiddleware");

// router.post("/create", verifyToken, productoController.crearPaciente);
router.get("/list",  productoController.listarProductos);
// router.get("/listDocuments", verifyToken, productoController.listarTipoDocumentos);
// router.get("/:id", verifyToken, productoController.obtenerPaciente);

module.exports = router;
