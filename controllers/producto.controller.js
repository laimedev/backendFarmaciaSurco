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
 


  exports.editarFotoProducto = (req, res) => {
    const codigo = req.body.codigo;
    const archivo = req.files?.foto;
  
    if (!codigo || !archivo) {
      return res.status(400).json({ message: 'Código e imagen son requeridos' });
    }
  
    const extension = '.jpg';
    const uploadsDir = path.join(__dirname, '../uploads');
    const nombreArchivo = `${codigo}${extension}`;
    const rutaFinal = path.join(uploadsDir, nombreArchivo);
  
    // Eliminar si ya hay una imagen anterior
    if (fs.existsSync(rutaFinal)) {
      fs.unlinkSync(rutaFinal);
    }
  
    // Mover imagen nueva
    archivo.mv(rutaFinal, (err) => {
      if (err) {
        console.error('Error al guardar imagen:', err);
        return res.status(500).json({ message: 'Error al subir imagen' });
      }
  
      const rutaFoto = `/uploads/${nombreArchivo}`;
  
      // Actualizar solo el campo `foto`
      Producto.actualizarSoloFoto(codigo, rutaFoto, (err2) => {
        if (err2) {
          console.error('Error SQL al guardar foto:', err2);
          return res.status(500).json({ message: 'Error al guardar ruta de foto' });
        }
  
        res.json({ success: true, message: 'Foto actualizada correctamente', ruta: rutaFoto });
      });
    });
  };