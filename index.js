require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const dbConnection = require('./config/db_config');
const apiRoutes = require("./routes/api");


app.use(cors());
app.use(express.json());


app.use("/api", apiRoutes);


dbConnection()
  .then((connection) => {
    console.log('Successful connection to the database.');
    connection.release();
    app.listen(port, () => {
      console.log('API Server of farmacia vidasana running');
    });
  })
  .catch((error) => {
    console.error('Error connecting to database: ', error);
});