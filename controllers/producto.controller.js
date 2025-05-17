const path = require('path');
const Producto = require('../models/producto.model');


exports.listarProductos = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  Producto.countFiltered(search, (err, countResult) => {
    if (err) return res.status(500).json({ message: 'Error contando productos' });

    Producto.getPaginated(page, limit, search, (err, data) => {
      if (err) return res.status(500).json({ message: 'Error listando productos' });

      res.json({
        total: countResult[0].total,
        page,
        limit,
        data
      });
    });
  });
};




// Obtener producto por ID
exports.obtenerPorId = (req, res) => {
    const codigo = req.params.codigo;
    Producto.getById(codigo, (err, data) => {
      if (err) return res.status(500).json({ message: 'Error al obtener producto' });
      if (data.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(data[0]);
    });
  };
  
  // Actualizar producto y subir imagen
  exports.editarProducto = (req, res) => {
    const datos = req.body;
    const archivo = req.file;
  
    if (archivo) {
      datos.foto = `/uploads/${archivo.filename}`;
    } else {
      datos.foto = req.body.foto || null;
    }
  
    Producto.updateProducto(datos, (err) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar producto' });
      res.json({ success: true, message: 'Producto actualizado correctamente' });
    });
  };
  