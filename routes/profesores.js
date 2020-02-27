let express = require('express');
let router = express.Router();
let profesoresController = require('../controllers/profesoresController');
router.get('/', profesoresController.index);
router.post('/setFalta/:id', profesoresController.setFalta);
router.post('/delFalta/:id', profesoresController.delFalta);
router.post('/justFalta/:id', profesoresController.justFalta);
module.exports = router;