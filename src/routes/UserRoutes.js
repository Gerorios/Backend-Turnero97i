const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUserById,
  deleteUserByUsername,
  registerUser,
  loginUser,
  getAllMedicos,
  changeUserRole,
} = require("../controllers/userController");


router.get("/getAllUsers", getAllUsers);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUserById);
router.delete("/usernameDelete/:username", deleteUserByUsername);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/medicos", getAllMedicos);
router.put('/userRoleChange/:id', changeUserRole);

module.exports = router;
