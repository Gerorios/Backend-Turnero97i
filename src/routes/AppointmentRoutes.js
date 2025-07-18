const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus
} = require("../controllers/AppointmentController");

const auth = require('../middlewares/auth');


router.get("/getAllAppointments" , getAllAppointments);

router.patch('/appointments/:id', updateAppointmentStatus);

router.get("/Appointments/:id", getAppointmentById);


router.post("/createAppointments",createAppointment);


router.put("/UpdateAppointments/:id", auth(["usuario", "admin"]),updateAppointment);


router.delete("/DeleteAppointment/:id",auth(["admin"]),deleteAppointment);

module.exports = router;
