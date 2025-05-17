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
    const codigo = datos.codigo;
    const archivo = req.files?.foto;
  
    // Ruta destino
    const uploadsDir = path.join(__dirname, '../uploads');
    // const extension = archivo ? path.extname(archivo.name) : '';
    const extension = '.jpg';
    const nombreArchivo = `${codigo}${extension}`;
    const rutaFinal = path.join(uploadsDir, nombreArchivo);
  
    if (archivo) {
      // Eliminar si ya existe imagen anterior con mismo nombre
      if (fs.existsSync(rutaFinal)) {
        fs.unlinkSync(rutaFinal);
      }
  
      // Mover nueva imagen
      archivo.mv(rutaFinal, (err) => {
        if (err) {
          console.error('Error al subir imagen:', err);
          return res.status(500).json({ message: 'Error al subir imagen' });
        }
  
        datos.foto = `/uploads/${nombreArchivo}`;
        actualizarProducto(datos, res);
      });
    } else {
      // Sin imagen nueva
      actualizarProducto(datos, res);
    }
  };
  
  // función auxiliar
  function actualizarProducto(datos, res) {
    Producto.updateProducto(datos, (err) => {
      if (err) {
        console.error('Error SQL:', err);
        return res.status(500).json({ message: 'Error al actualizar producto' });
      }
  
      res.json({ success: true, message: 'Producto actualizado correctamente' });
    });
  }
  