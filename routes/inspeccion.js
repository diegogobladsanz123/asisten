var express = require('express');
var router = express.Router();
var inspeccionController = require('../controllers/inspeccionController');

//Routes for Admin
router.get('/', inspeccionController.index); //para inspector general y para ic
router.post('/setInspector', inspeccionController.setInspector);
router.post('/unSetInspector/:idinspector', inspeccionController.unSetInspector);

router.post('/setInspectorGeneral', inspeccionController.setInspectorGeneral);

//Routes for IC
router.get('/getCursos', inspeccionController.getCursosForIc);
router.get('/getAlumnos/:idcurso', inspeccionController.getAlumnos);

//ic faltas
router.post('/faltas', inspeccionController.setFalta);
router.post('/faltas/justificar', inspeccionController.justFalta);
router.post('/faltas/eliminar', inspeccionController.delFalta);

//ic novedades
router.post('/novedades', inspeccionController.setNovedad);
router.post('/novedades/eliminar', inspeccionController.delNovedad);

//get IC para el IG
router.get('/registro_asistencia', inspeccionController.getIc);
router.get('/registro_asistencia/reportePDF', inspeccionController.reportePDF);
router.get('/registro_asistencia_docente', inspeccionController.registro_asistencia_docente);
router.get('/registro_asistencia_docente/ReportePdfDocente', inspeccionController.ReportePdfDocente);
router.get('/registro_asistencia/consultar', inspeccionController.getInasistenciasByIc);

module.exports = router;