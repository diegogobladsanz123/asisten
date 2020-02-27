var express = require('express');
var router = express.Router();
var autController = require('../controllers/authController');

/* GET home page. */
router.get('/', autController.onSession, function (req, res, next) {
  //res.render('index', { title: 'Express' });
  res.redirect('/inspeccion');
});

module.exports = router;
