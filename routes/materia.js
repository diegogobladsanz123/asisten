var express = require('express');
var router = express.Router();
var materiaController = require('../controllers/materiaController');

router.get('/', materiaController.index);
router.post('/', materiaController.store);
router.post('/edit/:id', materiaController.update);


module.exports = router;