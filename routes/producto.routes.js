const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productoController = require('../controllers/producto.controller');

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

// Rutas
router.get('/', productoController.listarProductos);
router.get('/:codigo', productoController.obtenerPorId);
router.put('/', upload.single('foto'), productoController.editarProducto);

module.exports = router;
