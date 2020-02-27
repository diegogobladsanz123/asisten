let db = require('../databaes');
let bcrypt = require('../public/javascripts/helpers');
module.exports = {
    onSession: (req, res, next) => {
        let idanio_lectivo = req.app.locals.user;
        let user = req.app.locals.user;


        if (req.isAuthenticated()) {
            let username = user.username;
            if (user.mapa.get(username) == undefined || username == undefined) {
                req.logOut();
                res.redirect('/');
            } else {
                //console.log('username = ', user.username, ' = ', user.mapa.get(username));
            }
            next();
        } else {
            res.redirect('/auth');
        }
    },
    offSession: (req, res, next) => {
        if (!req.isAuthenticated) {
            res.redirect('/auth');
        } else {
            next(); ////
        }
    },
    checkPass: async (req, res) => {
        let user = req.app.locals.user;
        let usuario = await db.query('SELECT * FROM user WHERE username = ? AND user_state = 1', [user.username]);
        let password = req.query.pwd;
        //res.send(user.fullname);
        if (usuario.length > 0) {
            usuario = usuario[0];
            if (await bcrypt.matchPassword(password, usuario.password)) {
                res.send('si');
            } else {
                res.send('no');
            }
        }
    }
}