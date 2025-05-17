const db = require('../config/db');

const Producto = {};

Producto.getPaginated = (page, limit, search, callback) => {
  const offset = (page - 1) * limit;
  const searchQuery = `%${search}%`;

  const query = `
    SELECT * FROM Productos
    WHERE descripcion LIKE ? OR nombre_marca LIKE ?
    LIMIT ? OFFSET ?
  `;
  db.query(query, [searchQuery, searchQuery, +limit, +offset], callback);
};

Producto.countFiltered = (search, callback) => {
  const searchQuery = `%${search}%`;
  const query = `
    SELECT COUNT(*) AS total FROM Productos
    WHERE descripcion LIKE ? OR nombre_marca LIKE ?
  `;
  db.query(query, [searchQuery, searchQuery], callback);
};



Producto.getById = (codigo, callback) => {
    db.query('SELECT * FROM Productos WHERE codigo = ?', [codigo], callback);
  };
  

  Producto.actualizarSoloFoto = (codigo, rutaFoto, callback) => {
    const query = `
      UPDATE Productos SET foto = ? WHERE codigo = ?
    `;
    db.query(query, [rutaFoto, codigo], callback);
  };


  
  Producto.updateProducto = (datos, callback) => {
    const { codigo, descripcion, cod_labo, nombre_marca, pre_neto, prec_caja, pre_frac, stock_cja, stock_unid, foto } = datos;
  
    const query = `
      UPDATE Productos SET 
        descripcion = ?, cod_labo = ?, nombre_marca = ?,
        pre_neto = ?, prec_caja = ?, pre_frac = ?, 
        stock_cja = ?, stock_unid = ?, foto = ?
      WHERE codigo = ?
    `;
  
    db.query(query, [descripcion, cod_labo, nombre_marca, pre_neto, prec_caja, pre_frac, stock_cja, stock_unid, foto, codigo], callback);
  };




module.exports = Producto;
