var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
let userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.index);
router.post('/', userController.store);
router.get('/create', userController.create);
router.get('/edit/:id', userController.edit);
router.post('/edit/:id', userController.update);
router.get('/delete/:id', userController.destroy);


module.exports = router;
