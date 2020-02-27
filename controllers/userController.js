let User = require('../models/userModel');
let Rol = require('../models/rolModel');
let Funcionario = require('../models/funcinarioModel');
let Inspector = require('../models/inspectorModel');
let {
    bcrypt
} = require('../public/javascripts/helpers');
let db = require('../databaes');
let Rol_user = require('../models/rol_userModel');
module.exports = {
    index: async (req, res) => {

        let user = req.app.locals.user;
        let username = user.username;
        let sesion_idanio_lectivo = user.mapa.get(username);
        try {
            let row = await User.getAll();
            let cursos = [];
            let ins = await Inspector.getAll();
            let anio = await db.query('SELECT * FROM anio_lectivo WHERE NOT anio_state = 0 ORDER BY idanio_lectivo DESC');


            res.render('auth/index', {
                title: 'Listado de usuarios',
                row: row,
                cursos,
                ins,
                anio,
                sesion_idanio_lectivo
            })
        } catch (e) {
            console.log(`-> Error en userController@index message: ${e.message}`);
            return e;
        }

    },
    create: async (req, res) => {
        let row = await Rol.getAll();
        let fun = await Funcionario.getAll(1);
        let anio = await db.query('SELECT * FROM anio_lectivo WHERE NOT anio_state = 0 ORDER BY idanio_lectivo DESC');
        //console.log(rol);
        res.render('auth/create', {
            title: 'Registrar Usuario',
            rol: row,
            fun,
            anio
        });
    },
    store: async (req, res) => {

        try {
            let user_ = req.app.locals.user;
            let username = user_.username;


            let user = await new User(
                req.body.username,
                req.body.fullname,
                await bcrypt(req.body.password),
                req.body.profesor_idprofesor == '' ? null : req.body.profesor_idprofesor,
                req.body.rol_idrol,
                req.body.user_state == 'undefined' ? 1 : 1,
                user_.mapa.get(username)
            )
            let row = await User.save(user);

            let rol_user = await new Rol_user(req.body.rol_idrol, row.insertId, user_.mapa.get(username));
            await Rol_user.save(rol_user);
            res.redirect('/users', req.flash('type', 'success'), req.flash('message', `El usuario ${req.body.fullname} fue registrado.`));

        } catch (e) {
            console.log(`-> ERROR en userController@store message: ${e.message}`);
            if (e.code == 'ER_DUP_ENTRY') {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error!. el username ya fue registrado`));
            }
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error al registrar, codigo: ${e.message}`));
            console.log(e);
        }

    },
    show: (req, res) => {},
    edit: async (req, res) => {
        try {
            let rol = await Rol.getAll();
            let user = await User.findOrFail(req.params.id);
            res.render('auth/edit', {
                title: 'Editar usuario',
                rol,
                users: user[0]
            });

        } catch (e) {
            console.log('->Error en userController@edit message: ' + e.message);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, mensage: ' + e.message));
        }

    },
    update: async (req, res) => {
        let userr = req.app.locals.user;
        let username = userr.username;
        try {
            //res.json(req.body);//
            //res.json(req.body);
            let user = new User(
                req.body.username,
                req.body.fullname,
                await bcrypt(req.body.password),
                req.body.profesor_idprofesor == '' ? null : req.body.profesor_idprofesor,
                req.body.rol_idrol ? req.body.rol_idrol : 1,
                1,
                userr.mapa.get(username)
            );

            User.update(user, req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', `Información actualizada.`));
        } catch (e) {
            console.log(`-> Error en userController@update message: ${e}`);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error al actualizar, mensaje: ${e.message}`));
        }
    },
    destroy: async (req, res) => {
        try {
            let user = await User.delete(req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El usuario fue desactivado'));
        } catch (e) {
            console.log(`-> Error en userController@destroy, message: ${e.message}`);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error al desactivar el usuario, codigo: ${e.message}`));
        }
    }
}