let express = require('express');
let router = express.Router();
let genPDF = require('../controllers/genPdf');
let alumnosController = require('../controllers/alumnosController');

router.post('/ficha/:idalumno', alumnosController.pdfFicha);

module.exports = router;