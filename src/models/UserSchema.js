const { Schema, model, mongoose } = require("mongoose");

const UserSchema = new Schema({
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Porfavor llena un email valido'],
      unique: true
    },

    password: {
        type: String,
        required: true,
    },

  name: {
    type: String,
    required: true,
    match: [/^[\p{L}\s]+$/u, 'Porfavor llena un nombre valido'],
  },
  last_name: {
    type: String,
    required: true,
    match: [/^[\p{L}\s]+$/u, 'Porfavor llena un apellido valido'],
  },

    phone_number: {
        type: String,
        match: [/^\d+$/],
        required: true,
    },
    role: {
        type: String,
        enum: ["usuario", "medico", "admin"],
        default: "usuario",
    },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
