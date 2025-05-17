const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const productoRoutes = require('./routes/producto.routes');

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Acceso libre a imágenes

app.use('/api/productos', productoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});