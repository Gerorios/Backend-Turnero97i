const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUserById,
  deleteUserByUsername,
  registerUser,
  loginUser,
  recoveryPass,
  changePass,
  getUserAppointments,
  getMedicoAppointments,
} = require("../controllers/userController");

// Ruta para obtener todos los usuarios
router.get("/", getAllUsers);

// Ruta para obtener un usuario por username
router.get("/:username", getOneUser);

// Ruta para actualizar un usuario por ID
router.put("/update/:id", updateUser);

// Ruta para eliminar un usuario por ID
router.delete("/delete/:id", deleteUserById);

// Ruta para eliminar un usuario por username
router.delete("/usernameDelete/:username", deleteUserByUsername);

// Ruta para registrar un nuevo usuario
router.post("/register", registerUser);

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Ruta para recuperar la contraseña
router.post("/recovery", recoveryPass);

// Ruta para cambiar la contraseña
router.post("/change-password", changePass);

// Ruta para obtener todos los turnos de un usuario
router.get("/:id/appointments", getUserAppointments);

// Ruta para obtener todos los turnos asignados a un médico
router.get("/medico/:id/appointments", getMedicoAppointments);

module.exports = router;
