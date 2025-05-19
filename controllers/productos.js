const Productos = require('../models/productos');

exports.listarProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const filters = { Nombre: req.query.searchTerm || '' };

    const { productos, totalRecords } = await Productos.list(page, pageSize, filters);
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.status(200).json({
      data: productos,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalRecords
      }
    });
  } catch (error) {
    console.error('Error en el controller:', error.message);
    res.status(500).json({ error: error.message });
  }
};
