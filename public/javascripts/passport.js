const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../databaes');
const bcrypt = require('./helpers');

var al;
let al2 = new Map();
let al3 = new Map();
let map_anio_lectivo = new Map();

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        al = req.body.anio_lectivo; //TODO: obtengo el id del año lectivo seleccionado
        let user = await db.query('SELECT * FROM user WHERE username = ? AND user_state = 1', [username]);
        if (user.length > 0) {
            user = user[0];
            if (await bcrypt.matchPassword(password, user.password)) {
                const anio_lectivo = await db.query('SELECT * FROM anio_lectivo WHERE idanio_lectivo = ?', [al]);
                al2.set(username, req.body.anio_lectivo); //guardado en el mapa
                if (anio_lectivo.length > 0) {
                    al3.set(username, anio_lectivo[0].anio_lectivo); //guardado en el mapa    
                    map_anio_lectivo.set(username, anio_lectivo[0].anio_state);
                }
                //validar si el usuario tiene rol asignado en el anio_lectivo seleccionado, de lo contrario impedir acceso
                if (user.iduser != 1) {
                    let ae = await db.query(`
                            SELECT
                                *
                            FROM
                                inspector
                            WHERE user_iduser = ?
                            AND anio_lectivo_idanio_lectivo = ?
                            AND estado = 1 `, [user.iduser, al]);
                    if (ae.length > 0) {
                        done(null, user, req.flash('type', 'success'), req.flash('message', `Bienvenido ${user.fullname}`));
                    } else {
                        done(null, null, req.flash('type', 'info'), req.flash('message', 'El usuario ingresado no tiene una función establecida para el año lectivo seleccionado. '))
                    }
                }
                done(null, user, req.flash('type', 'success'), req.flash('message', `Bienvenido ${user.fullname}`));



            } else {
                done(null, null, req.flash('type', 'warning'), req.flash('message', 'La contraseña es incorrecta'))
            };
        } else {
            done(null, null, req.flash('type', 'danger'), req.flash('message', `El usuario "${username}" no existe o se encuentra deshabilitado.`));
        }

    } catch (e) {
        console.log(`-> ERROR in passport.js message: ${e.message}`);
        return e;
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.iduser);
    /*passport.serializeUser() proporciona una función que toma dos parámetros:     
        - perfil de usuario(usuario) 
        - función de devolución de llamada(realizada)
    La función de devolución de llamada toma como segundo parámetro 
    la información de identificación(user.id) necesaria para recuperar 
    la cuenta de la base de datos.
    Esto se llamará en cada solicitud autenticada y almacena la información de identificación 
    en los datos de la sesión(ya sea en una cookie o en su tienda Redis).*/
})
passport.deserializeUser(async (id, done) => {
    try {
        let user = await db.query('SELECT * FROM user JOIN rol on rol.idrol = user.rol_idrol where iduser = ? ', [id]);
        const anio_lectivo = await db.query('SELECT * FROM anio_lectivo WHERE idanio_lectivo = ?', [al]);

        if (anio_lectivo.length > 0) {
            user[0].idanio_lectivo = anio_lectivo[0].idanio_lectivo;
            user[0].anio_lectivo = anio_lectivo[0].anio_lectivo;

        }

        user[0].mapa = al2;
        user[0].mapa2 = al3;
        user[0].map_anio_lectivo = map_anio_lectivo;


        done(null, user[0]);
        /*
        Se proporciona una función a passport.deserializeUser() que también toma dos parámetros, 
         - información de identificación(id) 
         - función de devolución de llamada(realizada).
         La información de identificación es lo que se serializó a los datos de sesión en la solicitud anterior(user.id).
         La función de devolución de llamada aquí requiere que el perfil del usuario sea su segundo parámetro, 
         o cualquier error que surja al recuperar el perfil como su primer parámetro.
         La función User.findById() es una función de búsqueda para el perfil de usuario en la base de datos.
         En este ejemplo, el objeto Usuario es una instancia de un modelo de mangosta que tiene la función findById().
        */

    } catch (e) {
        console.log(`-> ERROR in passport.js@deserializeUser message: ${e.message}`);
        return e;
    }
});