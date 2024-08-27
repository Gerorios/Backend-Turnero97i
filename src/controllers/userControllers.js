const UserModel = require("../models/UserSchema");
const AppointmentModel = require("../models/AppointmentSchema"); // Importamos el modelo de Appointment
const TipoEstudioModel = require("../models/TipoEstudioSchema"); // Importamos el modelo de TipoEstudio
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const recoveryPassMsg = require("../middlewares/user/updateUser/recoveryPass");

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    console.log(req.query);
    const numeroPagina = req.query.numeroPagina || 0;
    const limite = req.query.limite || 8;

    const [getUsers, count] = await Promise.all([
      UserModel.find()
        .select("-password")
        .skip(numeroPagina * limite)
        .limit(limite),
      UserModel.countDocuments(),
    ]);
    res.status(200).json({ msg: "All users:  ", getUsers, count, limite});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Obtener un usuario por username
const getOneUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username })
      .select("-password -_id")
      .populate("plan", "name");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Actualizar un usuario por ID
const updateUser = async (req, res) => {
  try {
    const update = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!update) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log(update);
    res.status(200).json({ msg: "User updated successfully", update });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Eliminar un usuario por username
const deleteUserByUsername = async (req, res) => {
  try {
    const user = await UserModel.findOneAndDelete({
      username: req.params.username,
    });

    const userResponse = {
      _id: user._id,
      username: user.username,
    };

    res
      .status(200)
      .json({ msg: "Username deleted successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Eliminar un usuario por ID
const deleteUserById = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    const userResponse = {
      _id: user._id,
      username: user.username,
    };

    res
      .status(200)
      .json({ msg: "User deleted successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const newUser = new UserModel(req.body);

    let salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(req.body.password, salt);

    await newUser.save();

    res.status(201).json({ msg: "Usuario creado con exito", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Iniciar sesión de usuario
const loginUser = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await UserModel.findOne({ username });

    const payload = {
      user: {
        idUser: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        pfp: user.pfp,
      },
    };

    const token = JWT.sign(payload, process.env.JWT_SECRETPASS);
    console.log(token);

    const role = user.role;

    res.status(200).json({ msg: "Usuario Logueado", token, role});
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Recuperación de contraseña
const recoveryPass = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    console.log(user); //borrar depsues

    const payload = {
      user: {
        idUser: user._id,
        username: user.username,
        role: user.role,
      },
    };

    const token = JWT.sign(payload, process.env.JWT_SECRETPASS);
    const response = await recoveryPassMsg(token, req.body.email);

    if (response === 200) {
      res.status(200).json({ msg: "An email has been sended to your account" });
    } else {
      res.status(422).json({ msg: "ERRMAIL. Email not sended" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Cambiar la contraseña
const changePass = async (req, res) => {
  try {
    console.log(req.body);
    const verifyToken = JWT.verify(req.body.token, process.env.JWT_SECRETPASS);
    const user = await UserModel.findOne({ _id: verifyToken.user.idUser });

    let salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(req.body.password, salt);

    await user.save();
    res.status(200).json({ msg: "Contraseña cambiada con exito" });
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Obtener todos los turnos de un usuario
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.id;
    const appointments = await AppointmentModel.find({ user: userId })
      .populate("tipoEstudio", "name")
      .populate("medico", "first_name last_name");

    if (!appointments) {
      return res.status(404).json({ msg: "Appointments not found" });
    }

    res.status(200).json({ msg: "User's appointments", appointments });
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Obtener todos los turnos asignados a un médico
const getMedicoAppointments = async (req, res) => {
  try {
    const medicoId = req.params.id;
    const appointments = await AppointmentModel.find({ medico: medicoId })
      .populate("user", "first_name last_name")
      .populate("tipoEstudio", "name");

    if (!appointments) {
      return res.status(404).json({ msg: "Appointments not found" });
    }

    res.status(200).json({ msg: "Medico's appointments", appointments });
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUserById,
  deleteUserByUsername,
  registerUser,
  loginUser,
  recoveryPass,
  changePass,
  getUserAppointments, // Nuevo método para obtener los turnos de un usuario
  getMedicoAppointments, // Nuevo método para obtener los turnos de un médico
};
