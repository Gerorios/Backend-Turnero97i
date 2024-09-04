const { Schema, model } = require("mongoose");

const TipoEstudioSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  // Otros campos relevantes para una sucursal
});

const BranchModel = model("TipoEstudio", TipoEstudioSchema);

module.exports = BranchModel;
