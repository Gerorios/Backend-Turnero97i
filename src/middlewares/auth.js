const jwt = require("jsonwebtoken");

const auth = (roles) => (req, res, next) => {
  try {
    const token = req.header("auth")?.replace("Bearer ", "");
    if (token) {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRETPASS);
      if (roles.includes(verifyToken.user.role)) {
        req.idUser = verifyToken.user.idUser;
        next();
      } else {
        res.status(401).json({ msg: "No estas autorizado" });
      }
    } else {
      res.status(400).json({ msg: "Token incorrecto" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;