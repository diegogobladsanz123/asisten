var express = require('express');
var router = express.Router();
function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}
let rolController = require('../controllers/rolController');
var db = require('../databaes');

router.get('/', rolController.index);
router.get('/edit/:id', rolController.edit)
router.post('/edit/:id', rolController.update);
router.get('/search', haltOnTimedout, rolController.findByName);

router.post('/', rolController.store);
router.get('/create', (req, res, next) => {
    res.render('configuracion/rol/create', {
        title: 'Registrar Rol'
    });
});

module.exports = router;