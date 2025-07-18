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
   
    this.app.use("/api", require("../routes/UserRoutes.js"));
    this.app.use("/api", require("../routes/AppointmentRoutes.js"));
    this.app.use("/api", require("../routes/TipoEstudioRoutes.js"));
  }

  middlewares() {
    this.app.use(express.json()); 
    this.app.use(express.urlencoded({ extended: true }));
    
    const corsOptions = {
      origin: "https://backend-turnero97i.onrender.com", // Reemplaza con el origen correcto de tu frontend
      credentials: true, 
    };

    this.app.use(cors(corsOptions));
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`server running on port ${process.env.PORT}`);
    });
  }
}

module.exports = Server;
