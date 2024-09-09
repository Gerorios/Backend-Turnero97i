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
router.get("/", getAllAppointments);

// Ruta para obtener una cita por ID
router.get("/:id", getAppointmentById);

// Ruta para crear una nueva cita
router.post("/",auth(["user","admin"]),createAppointment);

// Ruta para actualizar una cita por ID
router.put("/:id", auth(["user", "admin"]),updateAppointment);

// Ruta para eliminar una cita por ID
router.delete("/:id",auth(["admin"]),deleteAppointment);

module.exports = router;
