const UserModel = require("../models/UserSchema");
const AppointmentModel = require("../models/AppointmentSchema"); // Importamos el modelo de Appointment
const TipoEstudioModel = require("../models/TipoEstudioSchema"); // Importamos el modelo de TipoEstudio
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const recoveryPassMsg = require("../middlewares/recoverPass");

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

// Actualizar un usuario por ID
const updateUser = async (req, res) => {
  try {
    const update = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!update) {
      return res.status(404).json({ msg: "User not founda" });
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
     email:user.email,
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
     email:user.email,
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
    const salt = bcrypt.genSaltSync(10); // Aumentar la sal puede ser más seguro, ajusta según tu necesidad
    newUser.password = bcrypt.hashSync(req.body.password, salt);

    await newUser.save();

    res.status(201).json({ msg: "Usuario creado con éxito", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};


// Iniciar sesión de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verificar si el usuario existe por email
    const user = await UserModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }
    // Minimizar el payload del token
    const payload = {
      idUser: user._id,
      role: user.role,
    };
    
    // Crear el token
    const token = JWT.sign(payload, process.env.JWT_SECRETPASS, { expiresIn: '1h' });
    // Responder con el token y el rol del usuario
    res.status(200).json({ 
      msg: "Usuario Logueado", 
      token, 
      role: user.role,
      user: {  // Devuelve también los datos que necesitas en el frontend
        name: user.name,
        email: user.email,
        idUser: user._id,
        role: user.role,
      } 
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor", error });
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
       email:user.email,
        role: user.role,
      },
    };

    const token = JWT.sign(payload, process.env.JWT_SECRETPASS);
    const response = await recoveryPassMsg(token, email);

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
      .populate("user", "name last_name")
      .populate("tipoEstudio", "name")
      .select("name tipoEstudio");

    if (!appointments) {
      return res.status(404).json({ msg: "Appointments not found" });
    }

    res.status(200).json({ msg: "Medico's appointments", appointments });
  } catch (error) {
    res.status(500).json({ msg: "Error: Server", error });
  }
};

const getAllMedicos = async (req, res) => {
  try {
    const numeroPagina = parseInt(req.query.numeroPagina, 10) || 0;
    const limite = parseInt(req.query.limite, 10) || 8;

    // Busca todos los usuarios con el rol "medico"
    const [medicos, count] = await Promise.all([
      UserModel.find({ role: "medico" })  // Búsqueda insensible a mayúsculas
        .select('-password')  // Excluir la contraseña
        .skip(numeroPagina * limite)
        .limit(limite),
      UserModel.countDocuments({ role: "medico" })
    ]);
    
    console.log(medicos);
    if (!medicos || medicos.length === 0) {
      return res.status(404).json({ msg: "User not found" });  // Enviar 404 si no encuentra
    }

    res.status(200).json({ medicos, count, limite });
  } catch (error) {
    console.error("Error fetching medicos:", error);
    res.status(500).json({ msg: "Server error", error });
  }
};



module.exports = {
  getAllUsers,
  updateUser,
  deleteUserById,
  deleteUserByUsername,
  registerUser,
  loginUser,
  recoveryPass,
  changePass,
  getUserAppointments, // Nuevo método para obtener los turnos de un usuario
  getMedicoAppointments, // Nuevo método para obtener los turnos de un médico
  getAllMedicos,
};
