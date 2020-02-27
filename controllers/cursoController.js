let Curso = require('../models/cursoModel');
let Nivel = require('../models/nivelModel');
let Materia = require('../models/materiaModel');
let Funcionario = require('../models/funcinarioModel');
let Mhc = require('../models/mhcModel');
let Alumno = require('../models/alumnoModel');
let db = require('../databaes');
let Anio_lectivo = require('../models/anio_lectivoModel');

module.exports = {
    index: async (req, res) => {


        let user = req.app.locals.user;
        let username = user.username;

        //let anioLectivo = al.get(username);
        //res.send(anioLectivo);

        try {
            let rows = await Curso.getAll();
            let mhc = await Mhc.getMaterias(user.mapa.get(username));

            //Obener tutor

            let tutores = await Curso.findTutores(user.mapa.get(username));


            res.render('configuracion/curso/index', {
                title: 'Cursos..',
                row: rows,
                mhc,
                tutores

            });
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, mensaje: ' + e.message));
        }

    },
    create: async (req, res) => {
        try {
            let nivel = await Nivel.getAll();
            res.render('configuracion/curso/create.hbs', {
                title: 'Registrar curso',
                nivel
            });
        } catch (e) {
            res.redirect('back');
        }
    },
    store: async (req, res) => {
        try {
            let curso = new Curso(
                req.body.nombre,
                1,
                req.body.nivel_idnivel
            );
            await Curso.store(curso);

            res.redirect('/curso', req.flash('type', 'success'), req.flash('message', 'Se registro exitosamente.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar la información, codigo: ' + e.message));
        }
    },
    show: async (req, res) => {},
    edit: async (req, res) => {
        sinMatricula = [];
        try {

            sinMatricula = await Alumno.getAllSinMatricula();
            let cursos = await Curso.getAll2();
            let user = req.app.locals.user;
            let username = user.username;
            let niveles = await Nivel.getAll();
            let curso = await Curso.findOrFail(req.params.id);
            let tutor = [];
            let tut = await Curso.findTutor(req.params.id, user.mapa.get(username));
            let anioLecivos = await Anio_lectivo.getAll2();
            //console.log(anioLecivos)
            if (tut.length > 0) {
                tutor = tut[0];
            }
            let mat = await Materia.getAll(1);
            let fun = await Funcionario.getAll(1);
            let mhc = await Mhc.getAll(req.params.id, user.mapa.get(username));
            let alumnos = await Alumno.findByCurso(req.params.id, user.mapa.get(username));
            //res.json(alumnos);
            //res.send(tutor);
            //console.log(sinMatricula);
            res.render('configuracion/curso/edit', {
                title: 'Actualizar curso',
                niveles: niveles,
                curso: curso[0],
                materias: mat,
                funcionarios: fun,
                mhcs: mhc,
                alumnos,
                tutor,
                cursos,
                anioLecivos,
                sinMatricula
            });
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, codigo: ' + e.message));
        }

    },
    update: async (req, res) => {

        let user = req.app.locals.user;
        let username = user.username;
        //
        let estado = req.body.estado;
        if (estado == 0) {
            if (req.body.activar == 'on') {
                estado = 1;
            }
        }
        try {
            let curso = new Curso(
                req.body.cur_curso,
                estado,
                req.body.nivel_idnivel,
            );
            if (req.body.idtutor == '') {
                await db.query(`
            INSERT INTO tutor
            (curso_idcurso, funcionario_idfuncionario, idanio_lectivo)
            VALUES
                (?,?,?)
            `, [req.params.id, req.body.cur_tutor, user.mapa.get(username)]);
            } else {
                await db.query(`
            UPDATE tutor
            SET 
                curso_idcurso = ?,
                funcionario_idfuncionario = ?
            WHERE 
                idtutor = ?
            `, [req.params.id, req.body.cur_tutor, req.body.idtutor]);
            }

            await Curso.update(curso, req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El registro fue actualizado.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al actualizar la información, mensaje: ' + e.message));
        }

    },
    destroy: async (req, res) => {
        try {
            await Curso.destroy(req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El registro fue desactivado.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al desactivar el curso, mensaje: ' + e.message));
        }
    },
    materia_has_curso: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;
        let check = await Mhc.check(req.body.curso_idcurso, req.body.materia_idmateria);
        if (check.length > 0) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'La materia ya fue registrada'));
        } else {
            try {
                let mhc = new Mhc(
                    req.body.materia_idmateria,
                    req.body.curso_idcurso,
                    req.body.profesor_idprofesor,
                    req.body.mat_has_curso_horas,
                    req.body.mat_has_curso_estado == undefined ? 1 : req.body.mat_has_curso_estado,
                    user.mapa.get(username)
                );
                await Mhc.save(mhc);
                res.redirect('back', req.flash('type', 'success'), req.flash('message', 'La materia fue registrada.'));
            } catch (e) {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar, codigo: ' + e.message));
            }
        }
    },
    update_materia_has_curso: async (req, res) => {

        try {
            let mhc = new Mhc(
                req.body.materia_idmateria,
                req.body.curso_idcurso,
                req.body.profesor_idprofesor,
                req.body.mat_has_curso_horas,
                req.body.mat_has_curso_estado == undefined ? 1 : req.body.mat_has_curso_estado
            );

            await Mhc.update(mhc, req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'La materia fue registrada.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar, codigo: ' + e.message));
        }

    },
    findOrFail: async (req, res) => {
        try {
            let mhc = await Mhc.findOrFail(req.params.idmaterias_has_curso);
            if (mhc.length > 0) {
                res.send(mhc[0]);
            } else {
                res.send(null);
            }

        } catch (e) {
            console.log(e);
            res.send(JSON.stringify(e.message));
        }

    },
    delete: async (req, res) => {
        try {
            Mhc.delete(req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'La materia fue desvinculada.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al desvincular la materia, codigo: ' + e.message));
        }
    }
}