var express = require('express');
var router = express.Router();
var cursoController = require('../controllers/cursoController');

router.get('/', cursoController.index);

router.get('/edit/:id', cursoController.edit);
router.get('/create', cursoController.create);
router.post('/create', cursoController.store);
router.post('/edit/:id', cursoController.update);
router.post('/materia_has_curso', cursoController.materia_has_curso);
router.post('/materia_has_curso/update/:id', cursoController.update_materia_has_curso);
router.get('/materia_has_curso/delete/:id', cursoController.delete);
router.get('/curso/delete/:id', cursoController.destroy);
router.get('/materia_has_curso/get/:idmaterias_has_curso', cursoController.findOrFail);

module.exports = router;