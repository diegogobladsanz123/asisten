const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
let db = require('../databaes');

router.get('/', authController.offSession, async (req, res, next) => {
    if (req.app.locals.user) {

        res.redirect('/');
    }
    try {
        let anio = await db.query('SELECT * FROM anio_lectivo WHERE NOT anio_state = 0 ORDER BY idanio_lectivo DESC');

        res.render('auth/login', {
            title: 'Iniciar sesión',
            anio
        });

    } catch (error) {
        res.send('Error al obtener la información : ' + error)
    }

})
router.get('/signout', authController.onSession, (req, res, next) => {
    req.logOut();
    res.redirect('/');
})



router.post('/', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/auth',
        failureFlash: true
    })(req, res, next)
})

router.get('/checkPw', authController.checkPass);

module.exports = router;