const express = require('express');
const router = express.Router();
const {
  getTipoEstudio,
  getOneTipoEstudio,
  createTipoEstudio,
  updateTipoEstudio,
  deleteTipoEstudio,
} = require('../controllers/TipoEstudioController');


router.get('/tipo-estudios', getTipoEstudio);


router.get('/tipo-estudios/:estudio', getOneTipoEstudio);


router.post('/tipo-estudios', createTipoEstudio);


router.put('/tipo-estudios/:estudio', updateTipoEstudio);


router.delete('/tipo-estudios/:estudio', deleteTipoEstudio);

module.exports = router;