var express = require('express');
var router = express.Router();
let alumnosController = require('../controllers/alumnosController');

router.get('/', alumnosController.index);
router.get('/create', alumnosController.create);
router.get('/edit/:idalumno', alumnosController.edit);
router.post('/edit/:idalumno', alumnosController.update);
router.post('/', alumnosController.store);
router.get('/getAll/:idanio_lectivo/:idcurso', alumnosController.fetchAlumnos);
router.get('/ficha/:idalumno', alumnosController.ficha);
router.post('/mover', alumnosController.mover);
router.post('/asignarCurso', alumnosController.asignarCurso);
router.post('/quitarAlumnoDelCurso', alumnosController.quitarAlumnoDelCurso);
router.get('/findByCedula/:cedula', alumnosController.findByCedula);



router.get('/inasistencias', alumnosController.inasistencias);
router.get('/inasistencias/generatePDF', alumnosController.generatePDF);
router.get('/novedades', alumnosController.novedades);
router.get('/novedades/generatePDF', alumnosController.generatePDFnovedades);
router.get('/notificaciones', alumnosController.notificaciones);
router.post('/desactivarAlumno/:idalumno', alumnosController.desactivarAlumno);
router.post('/activarAlumno/:idalumno', alumnosController.activarAlumno);

module.exports = router;