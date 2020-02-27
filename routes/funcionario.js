var express = require('express');
var router = express.Router();
var funcionarioController = require('../controllers/funcionarioController');

router.get('/', funcionarioController.index);
router.post('/', funcionarioController.store);
router.get('/delete/:id', funcionarioController.delete);
router.get('/create', funcionarioController.create);
router.get('/edit/:id', funcionarioController.edit);
router.post('/edit/:id', funcionarioController.update);

router.get('/findByCi/:ci', funcionarioController.findByCi);

router.get('/inasistencias', funcionarioController.inasistencias);


module.exports = router;