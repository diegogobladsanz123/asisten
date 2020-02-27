var express = require('express');
var router = express.Router();
var notificacionController = require('../controllers/notificacionController');

router.get('/', notificacionController.index);
router.get('/get/:id', notificacionController.getNotificacion);
router.post('/', notificacionController.store);
router.post('/delete/:id', notificacionController.delete);
module.exports = router;