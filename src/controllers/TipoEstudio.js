const TipoEstudio = require("../models/TipoEstudio");

const getTipoEstudios = async (req, res) => {
  try {
    console.log(req.query);
    const numeroPagina = req.query.numeroPagina || 0;
    const limite = req.query.limite || 8;

    const [getTipoEstudios, count] = await Promise.all([
      TipoEstudio.find()
        .skip(numeroPagina * limite)
        .limit(limite),
      TipoEstudio.countDocuments(),
    ]);
    res
      .status(200)
      .json({ msg: "All estudios:  ", getTipoEstudios, count, limite });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }

  const getOneTipoEstudio = async (req, res) => {
    const { estudio } = req.params;
    try {
      const tipoestudio = await TipoEstudio.findOne({ estudio }).select("-_id");

      if (!tipoestudio) {
        return res.status(404).send({ message: "Estudio not found" });
      }
      res.send(tipoestudio);
    } catch (error) {
      res.status(500).json({ msg: "Error: Server", error });
    }
  };

  const createTipoEstudio = async (req, res) => {
    const { estudio, descripcion } = req.body;
    try {
      const newTipoEstudio = new TipoEstudio({ estudio, descripcion });
      await newTipoEstudio.save();
      res.status(201).json({ msg: "Tipo de estudio creado", newTipoEstudio });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error: Server", error });
    }
  };
  
  // Actualizar un tipo de estudio
  const updateTipoEstudio = async (req, res) => {
    const { estudio } = req.params;
    const { descripcion } = req.body;
    try {
      const updatedTipoEstudio = await TipoEstudio.findOneAndUpdate(
        { estudio },
        { descripcion },
        { new: true }
      );
  
      if (!updatedTipoEstudio) {
        return res.status(404).send({ message: "Estudio not found" });
      }
  
      res.status(200).json({ msg: "Tipo de estudio actualizado", updatedTipoEstudio });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error: Server", error });
    }
  };
  
  // Eliminar un tipo de estudio
  const deleteTipoEstudio = async (req, res) => {
    const { estudio } = req.params;
    try {
      const deletedTipoEstudio = await TipoEstudio.findOneAndDelete({ estudio });
  
      if (!deletedTipoEstudio) {
        return res.status(404).send({ message: "Estudio not found" });
      }
  
      res.status(200).json({ msg: "Tipo de estudio eliminado", deletedTipoEstudio });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error: Server", error });
    }
  };
  
  module.exports = {
    getTipoEstudios,
    getOneTipoEstudio,
    createTipoEstudio,
    updateTipoEstudio,
    deleteTipoEstudio,
  };
};
