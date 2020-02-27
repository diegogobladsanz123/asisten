let Funcionario = require('../models/funcinarioModel');
let Materias = require('../models/materiaModel');
let InasistenciaProfesor = require('../models/InasistenciaProfesorModel');
let db = require('../databaes');
module.exports = {
    index: async (req, res) => {

        if (req.app.locals.user.idrol == 3) {//inspector de curso
            try {

                let user = req.app.locals.user;
                let username = user.username;
                let anio_state = await db.query(`SELECT anio_state FROM anio_lectivo WHERE idanio_lectivo = ?`, [user.mapa.get(username)]);

                if (anio_state.length > 0) {
                    anio_state = anio_state[0].anio_state;
                }
                // 
                //inacistencias para inspector de curso
                let inasistencias = await Funcionario.getAllInasistenciasFaltasForIc(req.app.locals.user.iduser, user.mapa.get(username));
                //si el usuario es inspector de curso.
                let funcionarios = await Funcionario.getProfesoresForIc(req.app.locals.user.iduser, user.mapa.get(username));

                //let funcionarios = [];

                res.render('profesoresForIc/index', {
                    title: 'Listado de profesores',
                    profesores: funcionarios,
                    inasistencias,
                    anio_state

                });
            } catch (e) {
                console.log(`Error ar profesoresController@index Error: ${e}`);
                res.redirect('/', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un problema. Message: ' + e));
            }
        } else if (req.app.locals.user.idrol == 42) { //inspector general
            try {
                let user = req.app.locals.user;
                let username = user.username;
                let anio_state = await db.query(`SELECT anio_state FROM anio_lectivo WHERE idanio_lectivo = ?`, [user.mapa.get(username)]);

                if (anio_state.length > 0) {
                    anio_state = anio_state[0].anio_state;
                }

                //inacistencias para inspector general
                let inasistencias = await Funcionario.getAllInasistenciasFaltas(user.mapa.get(username));
                //si el usuario es inspector general
                let funcionarios = await Funcionario.getProfesoresForIg(user.mapa.get(username));;
                res.render('profesoresForIc/index', {
                    title: 'Listado de profesores',
                    profesores: funcionarios,
                    inasistencias,
                    anio_state
                });
            } catch (e) {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un problema. Message: ' + e));
            }
        } else if (req.app.locals.user.idrol == 1) {
            try {
                let user = req.app.locals.user;
                let username = user.username;
                let anio_state = await db.query(`SELECT anio_state FROM anio_lectivo WHERE idanio_lectivo = ?`, [user.mapa.get(username)]);

                if (anio_state.length > 0) {
                    anio_state = anio_state[0].anio_state;
                }

                //
                //inacistencias para admin
                let inasistencias = await Funcionario.getAllInasistenciasFaltas(user.mapa.get(username));
                //si el usuario es inspector de curso.
                let funcionarios = await Funcionario.getProfesoresForIg(user.mapa.get(username));

                res.render('profesoresForIc/index', {
                    title: 'Listado de profesores',
                    profesores: funcionarios,
                    inasistencias,
                    anio_state
                });
            } catch (e) {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un problema. Message: ' + e));
            }
        } else {
            res.redirect('/funcionario');
        }
    },
    setFalta: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;

        let inasistencia = new InasistenciaProfesor(
            req.body.ina_tipo,
            req.body.idprofesor,
            req.body.ina_fecha,
            req.body.ina_hora,
            req.app.locals.user.iduser,
            req.body.idmaterias,
            req.body.mat_nombre ? req.body.mat_nombre : 'FALTA TODO EL DÍA',
            req.body.idcurso,
            req.body.cur_curso,
            req.body.justificado_coment,
            req.body.injustificado_coment,
            req.app.locals.user.fullname,
            user.mapa.get(username)
        )

        try {

            await InasistenciaProfesor.save(inasistencia);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Se registro correctamente.'))
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un problema. Message: ' + e));
        }

        if (req.body.ina_tipo == 1) {
            //falta por día
        } else if (req.body.ina_tipo == 2) {
            //falta por hora

        }

    },
    delFalta: async (req, res) => {
        try {
            let user = req.app.locals.user;
            await InasistenciaProfesor.delete(req.params.id, req.body.eliminado_coment, user.fullname);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Registro eliminado.'))
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un problema. Message: ' + e));
        }

    },
    justFalta: async (req, res) => {
        try {
            let user = req.app.locals.user;
            await InasistenciaProfesor.justificar(req.params.id, req.body.justificado_coment, req.body.justificado_fecha, user.fullname);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Inasistencia justificada.'))
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un problema. Message: ' + e));
        }
    }

}