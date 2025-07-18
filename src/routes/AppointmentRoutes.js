const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getMyAppointments,
  getAppointmentsByMedico
} = require("../controllers/AppointmentController");
const auth = require('../middlewares/auth');


router.get("/getAllAppointments" , getAllAppointments);
router.get("/myAppointments",auth(["usuario"]), getMyAppointments);
router.get("/medico/Appointment", auth(["medico"]), getAppointmentsByMedico);
router.get("/Appointments/:id", getAppointmentById);
router.patch('/appointments/:id', updateAppointmentStatus);
router.post("/createAppointments",createAppointment);
router.put("/UpdateAppointments/:id", auth(["usuario", "admin"]),updateAppointment);
router.delete("/DeleteAppointment/:id",auth(["admin"]),deleteAppointment);

module.exports = router;
