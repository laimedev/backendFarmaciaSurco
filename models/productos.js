const dbConnection = require('../config/db_config');

const Productos = {
  list: async (page, pageSize, filters) => {
    try {
      const connection = await dbConnection();
      const offset = (page - 1) * pageSize;
      const search = `%${filters.Nombre || ''}%`;

      // Consulta de conteo
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM fac_catalogo c
        LEFT JOIN fac_categoria cat ON c.id_categoria = cat.id_categoria
        LEFT JOIN fac_marca m ON c.id_marca = m.id_marca
        WHERE (c.catalogo LIKE ? OR cat.categoria LIKE ? OR m.marca LIKE ?)
          AND c.eliminado = 0
      `;
      const [countResult] = await connection.query(countQuery, [search, search, search]);
      const totalRecords = countResult[0].total;

      // Consulta de datos
      const dataQuery = `
        SELECT 
          c.id_catalogo,
          c.catalogo,
          c.codigo_interno,
          c.foto,
          cat.categoria,
          um.unidad_medida,
          m.marca,
          lp.precio_venta,
          lp.stock_actual,
          lp.porcentaje_ganancia,
          c.precio_venta_cigv,
          c.activo
        FROM fac_catalogo c
        LEFT JOIN fac_categoria cat ON c.id_categoria = cat.id_categoria
        LEFT JOIN fac_unidad_medida um ON c.id_unidad_medida = um.id_unidad_medida
        LEFT JOIN fac_marca m ON c.id_marca = m.id_marca
        LEFT JOIN fac_local_producto lp ON c.id_catalogo = lp.id_catalogo
        WHERE (c.catalogo LIKE ? OR cat.categoria LIKE ? OR m.marca LIKE ?)
          AND c.eliminado = 0
        ORDER BY c.id_catalogo DESC
        LIMIT ? OFFSET ?
      `;

      const [productos] = await connection.query(dataQuery, [search, search, search, pageSize, offset]);

      // Parsear las fotos
      const productosParsed = productos.map(p => {
        let fotos = [];
        try {
          fotos = p.foto ? JSON.parse(p.foto) : [];
        } catch (e) {
          console.warn(`Error al parsear foto del producto ID ${p.id_catalogo}:`, e.message);
        }
        return { ...p, foto: fotos };
      });

      connection.release();

      return {
        productos: productosParsed,
        totalRecords
      };

    } catch (error) {
      console.error('Error al listar productos:', error.message);
      throw new Error('Error al listar productos');
    }
  }
};

module.exports = Productos;
