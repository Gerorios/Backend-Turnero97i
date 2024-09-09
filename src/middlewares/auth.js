const jwt = require("jsonwebtoken");

const auth = (roles) => (req, res, next) => {
  try {
    console.log("Headers recibidos:", req.headers);

    const token = (req.header("Authorization") || req.header("auth") || req.header("bearer") || "").replace("Bearer ", "").trim();
    
    console.log("Token extraído:", token);

    if (token) {
      try {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRETPASS);
        console.log("Token verificado:", verifyToken);

        if (verifyToken.role && roles.includes(verifyToken.role)) {
          req.idUser = verifyToken.idUser;
          console.log("Usuario autorizado:", req.idUser);
          next();
        } else {
          console.log("Rol no autorizado. Rol del token:", verifyToken.role);
          console.log("Roles permitidos:", roles);
          res.status(401).json({ msg: "No estás autorizado" });
        }
      } catch (verifyError) {
        console.log("Error al verificar el token:", verifyError);
        res.status(401).json({ msg: "Token inválido" });
      }
    } else {
      console.log("No se proporcionó token");
      res.status(400).json({ msg: "Token incorrecto" });
    }
  } catch (error) {
    console.log("Error en la autenticación:", error);
    res.status(500).json({ msg: "Error del servidor en la autenticación" });
  }
};

module.exports = auth;