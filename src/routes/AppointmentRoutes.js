const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/AppointmentController");

const auth = require('../middlewares/auth');

// Ruta para obtener todas las citas
router.get("/getAllAppointments" , getAllAppointments);

// Ruta para obtener una cita por ID
router.get("/Appointments/:id", getAppointmentById);

// Ruta para crear una nueva cita
router.post("/createAppointments",createAppointment);

// Ruta para actualizar una cita por ID
router.put("/UpdateAppointments/:id", auth(["usuario", "admin"]),updateAppointment);

// Ruta para eliminar una cita por ID
router.delete("/DeleteAppointment/:id",auth(["admin"]),deleteAppointment);

module.exports = router;
