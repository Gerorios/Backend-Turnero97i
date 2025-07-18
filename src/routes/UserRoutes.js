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
  getAllMedicos,
  changeUserRole,
} = require("../controllers/userController");


router.get("/getAllUsers", getAllUsers);


router.put("/update/:id", updateUser);


router.delete("/delete/:id", deleteUserById);

router.delete("/usernameDelete/:username", deleteUserByUsername);

router.post("/register", registerUser);


router.post("/login", loginUser);


router.post("/recovery", recoveryPass);


router.post("/change-password", changePass);


router.get("/:id/appointments", getUserAppointments);


router.get("/medico/:id/appointments", getMedicoAppointments);


router.get("/medicos", getAllMedicos);

router.put('/userRoleChange/:id', changeUserRole);

module.exports = router;
