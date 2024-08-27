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

//   first_name: String,
//   last_name: String,

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

//   plan: {
//     type: Schema.Types.ObjectId,
//     ref: "Plan",
//   },

    pfp: {
        type: String,
    },

});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
