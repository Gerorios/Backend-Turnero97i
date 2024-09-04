
const { Schema, model } = require("mongoose");

const AppointmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tipoEstudio: {
    type: Schema.Types.ObjectId,
    ref: "TipoEstudio",
    required: true,
  },
  medico: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

});

const AppointmentModel = model("Appointment", AppointmentSchema);

module.exports = AppointmentModel;
