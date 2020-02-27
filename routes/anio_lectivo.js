let express = require('express');
let router = express.Router();
let anio_lectivoController = require('../controllers/anio_lectivoController');

router.get('/', anio_lectivoController.index);
router.post('/create', anio_lectivoController.store);
router.post('/activar/:idanio_lectivo', anio_lectivoController.activar);
router.post('/finalizar/:idanio_lectivo', anio_lectivoController.finalizar);
module.exports = router;