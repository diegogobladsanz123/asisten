let Funcionario = require('../models/funcinarioModel');
let Materia = require('../models/materiaModel');
module.exports = {
    index: async (req, res) => {

        try {
            rows = await Funcionario.getAll();
            res.render('configuracion/funcionario/index', {
                title: 'Funcionarios',
                rows
            });
        } catch (e) {
            req.flash('type', 'warning');
            req.flash('message', `Ocurrió un problema al recuperar la información, mensage: ${e.message}`);
            res.render('configuracion/funcionario/index', {
                title: 'Funcionarios',
            });
        }

    },
    create: (req, res) => {
        res.render('configuracion/funcionario/create')
    },
    store: async (req, res) => {

        try {
            let fun = new Funcionario(
                req.body.fun_nombres,
                req.body.fun_cedula,
                req.body.fun_titulo,
                req.body.fun_teléfono,
                1,
            )
            await Funcionario.save(fun);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El registro fue ingresado.'));
        } catch (e) {
            if (e.code == 'ER_DUP_ENTRY') {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Ya existe un registro con los valores ingresados, por favor consulte en el listado principal.`));
            }
            console.log(`Error en funcionarioController@store, mensaje: ${e}`);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error al registrar, mensaje: ${e.message}`));
        }


    },
    delete: async (req, res) => {
        try {
            let funcionario = await Funcionario.delete(req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El registro fue desactivado.'));
        } catch (e) {
            console.log(`-> Error en funcionarioController@delete, mensaje: ${e.message}`);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error al desactivar, mensaje: ${e.message}`));
        }
    },
    edit: async (req, res) => {

        try {
            let user = req.app.locals.user;
            let username = user.username;
            let materias = await Materia.findByIdProfesor(req.params.id, user.mapa.get(username));
            let inasistencias = await Funcionario.getAllInasistenciasFaltasById(req.params.id, user.mapa.get(username));


            let fun = await Funcionario.findById(req.params.id);
            if (fun.length > 0) {
                res.render('configuracion/funcionario/edit', {
                    title: 'Editar Funcionario',
                    fun: fun[0],
                    materias,
                    inasistencias
                });
            } else {
                res.redirect('back', req.flash('type', 'warning'), req.flash('message', 'No se pudo cargar la información'))
            }

        } catch (e) {
            console.log(`-> Error en funcionarioController@edit, mensaje: ${e.message}`)
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error al obtener la información, mensaje: ${e.message}`))
        }
    },
    update: async (req, res) => {
        try {
            let row = new Funcionario(
                req.body.fun_nombres,
                req.body.fun_cedula,
                req.body.fun_titulo,
                req.body.fun_telefono,
                1,
            );
            await Funcionario.update(row, req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', `El registro fue actualizado`));
        } catch (e) {
            console.log(`-> Error en funcionarioController@update, mensaje: ${e.message}`);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Ocurrio un problema, mensage: ${e.message}`))
        }

    },
    findByCi: async (req, res) => {
        let row = await Funcionario.findByCi(req.params.ci);
        if (row.length > 0) {
            res.send(row[0]);
        } else {
            res.send(false);
        }
    },
    inasistencias: async (req, res) => {
        let inasistencias = await Funcionario.getAllInasistenciasFaltas();

        res.render('configuracion/funcionario/inasistencias', {
            title: 'Inasistencias',
            inasistencias
        })
    }
}