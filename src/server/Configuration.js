require("dotenv").config();
require("./databaseConfiguration.js");
const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  routes() {
    // this.app.use(isJsonMiddleware); PREGUNTAR
  }

  middlewares() {
    this.app.use(express.json()); // Para parsear JSON
    this.app.use(express.urlencoded({ extended: true }));
    // Configuración de CORS
    const corsOptions = {
      origin: "http://localhost:5173", // Reemplaza con el origen correcto de tu frontend
      credentials: true, // Permite incluir cookies en las solicitudes (necesario para el modo credentials: 'include')
    };

    this.app.use(cors(corsOptions));
  }

  listen() {
    this.app.listen(5000, () => {
      console.log(`server running on port 5000`);
    });
  }
}

module.exports = Server;
