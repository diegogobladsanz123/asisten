let Alumno = require('../models/alumnoModel');
let Inasistencia = require('../models/inasistenciaModel');
let Materia = require('../models/materiaModel');
let Curso = require('../models/cursoModel');
let Notificaciones = require('../models/notificacionModel');
let Funcionario = require('../models/funcinarioModel');
let db = require('../databaes');
let genPdf = require('../controllers/genPdf');
let dateFormat = require('dateformat');


module.exports = {

    index: async (req, res) => {
        let alumnos = [];
        let user = req.app.locals.user;
        let username = user.username;
        let total_registros = 0;
        let total_registros_sin_matricula = 0;

        //get cursos
        let cursos = await Curso.getAll2();

        //for query
        const queryIdcurso = req.query.idcurso;
        const querySearchText = req.query.searchText;

        //for apginate;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);


        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        let sinMatricula = [];
        var sql;

        //administrador o inspector general
        if (user.idrol == 1 || user.idrol == 42) {
            sinMatricula = await Alumno.getAllSinMatricula();
            if (queryIdcurso != undefined && queryIdcurso != '') {
                console.log('byCurso');
                //consultar por curso
                sql = await Alumno.findByCurso(queryIdcurso, user.mapa.get(username));
            } else if (querySearchText != undefined && querySearchText != '') {
                console.log('bySearchText');
                //consultar por cedula o alumno
                sql = await Alumno.findByCedulaOrNombre(querySearchText.trim(), user.mapa.get(username));
            } else {
                //Obtener todos los registros
                console.log('todos');
                sql = await Alumno.getAll(user.mapa.get(username));

            }

            if (endIndex < sql.length) {
                results.next = {
                    page: page + 1,
                    limit: limit,
                    total: sql.length
                }
            }

            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit,
                    total: sql.length
                }
            }


            results.results = sql.slice(startIndex, endIndex);
        } else {
            //inspector de curso 

            let curso = await Curso.getCursosForIc(user.iduser, user.mapa.get(username));

            for (let index = 0; index < curso.length; index++) {
                let val = await Alumno.findByCurso(curso[index].idcurso, user.mapa.get(username));
                //results.results = val;
                val.forEach((element) => {
                    alumnos.push(element);
                });
            }
            results.results = alumnos;

        }
        //res.json(results)
        total_registros = results.results.length;
        total_registros_sin_matricula = sinMatricula.length;
        res.render('alumnos/index.hbs', {
            title: 'Listado de alumnos',
            results,
            cursos,
            sinMatricula,
            total_registros,
            total_registros_sin_matricula
        })
    },
    create: async (req, res) => {
        res.render('alumnos/create', {
            title: 'Registrar alumno',
            ruta: '/alumnos'
        })
    },
    edit: async (req, res) => {
        let alumno = '';
        try {
            alumno = await db.query(`
                    SELECT                    
                    alu_cedula,
                    alu_apellidos_nombres,
                    alu_fecha_nac,
                    alu_lugar_nac,
                    alu_direccion,
                    alu_representante_nombres,
                    alu_representante_telefono,
                    idanio_lectivo,
                    idalumno
                    FROM
                    alumno
                    WHERE idalumno = ? `, [req.params.idalumno]);

            alumno.length > 0 ? alumno = alumno[0] : res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'El alumno no esta registrado'));
            res.render('alumnos/create', {
                title: 'Actualizar alumno',
                ruta: `/alumnos/edit/${req.params.idalumno}`,
                alumno
            })
        } catch (error) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, Error: ', error.message));
        }

    },
    store: async (req, res) => {
        let body = req.body;
        let user = req.app.locals.user;
        let username = user.username;
        try {
            let al = new Alumno(body.alu_cedula,
                body.alu_apellidos_nombres,
                body.alu_fecha_nac,
                body.alu_lugar_nac,
                body.alu_direccion,
                body.alu_representante_nombres,
                body.alu_representante_telefono,
                user.mapa.get(username)
            );
            let newAlumno = await Alumno.store(al);
            res.redirect('/alumnos?page=1&limit=50', req.flash('type', 'success'), req.flash('message', 'El alumno fue registrado.'));
        } catch (error) {
            console.log(error);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', error.message));
        }
    },
    update: async (req, res) => {
        let body = req.body;
        let user = req.app.locals.user;
        let username = user.username;
        try {
            let al = new Alumno(body.alu_cedula,
                body.alu_apellidos_nombres,
                body.alu_fecha_nac,
                body.alu_lugar_nac,
                body.alu_direccion,
                body.alu_representante_nombres,
                body.alu_representante_telefono,
                user.mapa.get(username)
            );
            await Alumno.update(al, req.params.idalumno);

            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'La información fue actualizada.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al actualizar la información, Error: ', e));
        }
    },
    ficha: async (req, res) => {
        let ficha = 1;

        try {
            //inasistencias para el detalle
            let user = req.app.locals.user;
            let username = user.username;
            let anio_state = await db.query(`SELECT anio_state FROM anio_lectivo WHERE idanio_lectivo = ?`, [user.mapa.get(username)]);
            if (anio_state.length > 0) {
                anio_state = anio_state[0].anio_state;
            }


            let inasistencias = await Inasistencia.findInasistenciaById(req.params.idalumno, user.mapa.get(username));

            let notificaciones = await Notificaciones.getAllById(req.params.idalumno, user.mapa.get(username));
            let detalleNotificaciones = await Notificaciones.getDetalle();

            let novedades = await Inasistencia.findNovedadesById(req.params.idalumno, user.mapa.get(username));

            let funcionarios = await Funcionario.getAll();

            anio_lectivo = [];


            let alumno = await Alumno.findById(req.params.idalumno, user.mapa.get(username));

            if (alumno.length > 0) {
                anio_lectivo = await db.query('SELECT * FROM anio_lectivo WHERE idanio_lectivo = ?', [user.mapa.get(username)]);
            }
            if (alumno.length > 0 && anio_lectivo.length > 0) {
                alumno[0].idanio_lectivo = anio_lectivo[0].idanio_lectivo;
                alumno[0].anio_lectivo = anio_lectivo[0].anio_lectivo;
            }

            let idcurso = alumno[0].idcurso;

            //inasistencias y materias para calcular el porcentaje de faltas en las materias
            let ifm = await Inasistencia.findInasistenciaByIdForCalculate(req.params.idalumno, user.mapa.get(username));
            let materias = await Materia.findByCurso(idcurso, user.mapa.get(username));

            //Obener tutor
            let tutor = [];
            let tut = await Curso.findTutor(idcurso, user.mapa.get(username));
            if (tut.length > 0) {
                tutor = tut[0];
            }

            //contador de faltas por materia
            let agrupado = ifm.reduce((accum, row) => {
                let {
                    materias_idmaterias: id
                } = row;
                accum[id] = accum[id] || {
                    id,
                    total: 0
                };

                for (let index = 0; index < materias.length; index++) {
                    if (materias[index].idmaterias == id) {
                        accum[id].totalHoras = materias[index].mat_has_curso_horas;
                        accum[id].tenpercent = Math.ceil(materias[index].mat_has_curso_horas * req.app.locals.p_f_m / 100);
                    }

                }
                accum[id].total++;

                return accum;
            }, {});


            console.log(inasistencias)
            //Las inasistencias eliminadas se presentan solo al administrador,
            //cualquier otro usuario puede ver solo las inasistencias activas
            if (user.idrol != 1) {
                //total 5

                for (var i = inasistencias.length - 1; i >= 0; i--) {
                    if (inasistencias[i].ina_estado == 0) {
                        inasistencias.splice(i, 1);
                    }
                }
                for (var i = novedades.length - 1; i >= 0; i--) {
                    if (novedades[i].nov_state == 0) {
                        novedades.splice(i, 1);
                    }
                }
                for (var i = notificaciones.length - 1; i >= 0; i--) {
                    if (notificaciones[i].not_estado == 0) {
                        notificaciones.splice(i, 1);
                    }
                }



            }

            res.render('alumnos/ficha.hbs', {
                title: 'Ficha estudiantil',
                alumno: alumno[0],
                inasistencias,
                novedades,
                materias,
                ifm,
                agrupado,
                notificaciones,
                funcionarios,
                tutor,
                anio_state,
                ficha,
                detalleNotificaciones
            })
        } catch (e) {
            console.log(e)

            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, mensaje: ' + e));
        }

    },
    fetchAlumnos: async (req, res) => {
        /*test ajax request*/
        try {
            let alumnos = await Alumno.findByCurso(req.params.idcurso, req.params.idanio_lectivo)
            //console.log(alumnos)
            return res.json(alumnos);
        } catch (e) {
            return e;
        }



    },
    novedades: async (req, res) => {
        let fecha_desde = req.query.fecha_desde;
        let fecha_hasta = req.query.fecha_hasta;
        let now = dateFormat(new Date(), "yyyy-mm-dd");
        fecha_desde ? fecha_desde : fecha_desde = now;
        fecha_hasta ? fecha_hasta : fecha_hasta = fecha_desde;



        try {
            let user = req.app.locals.user;
            let username = user.username;
            let novedades = [];
            //administrador o inspector general
            if (user.idrol == 1 || user.idrol == 42) {
                //novedades = await Inasistencia.getAllNovedades(user.mapa.get(username));
                novedades = await Inasistencia.getAllNovedadesWidthDate(user.mapa.get(username), fecha_desde, fecha_hasta);

            } else {
                novedades = await Inasistencia.getAllNovedadesByIc(user.iduser, user.mapa.get(username));

            }
            res.render('alumnos/novedades', {
                title: 'Novedades',
                novedades,
                fecha_desde,
                fecha_hasta
            })
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, ', e));
        }

    },
    inasistencias: async (req, res) => {
        let fecha_desde = req.query.fecha_desde;
        let fecha_hasta = req.query.fecha_hasta;
        let now = dateFormat(new Date(), "yyyy-mm-dd");

        console.log(now);

        fecha_desde ? fecha_desde : fecha_desde = now;
        fecha_hasta ? fecha_hasta : fecha_hasta = fecha_desde;

        try {
            let user = req.app.locals.user;
            let username = user.username;
            let inasistencias = [];
            //administrador o inspector general
            if (user.idrol == 1 || user.idrol == 42) {

                //inasistencias = await Inasistencia.getAllInasistencias(user.mapa.get(username));

                inasistencias = await Inasistencia.getAllInasistenciasWidthDate(user.mapa.get(username), fecha_desde, fecha_hasta);


                //res.json(inasistencias);
            } else {
                //inasistencias para el inspector de curso
                inasistencias = await Inasistencia.getAllInasistenciasByIdUser(user.iduser, user.mapa.get(username));

            }
            res.render('alumnos/inasistencias', {
                title: 'Inasistencias',
                inasistencias,
                fecha_desde,
                fecha_hasta
            })
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información =>', e));
        }

    },
    generatePDF: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;

        let usuario = req.query.user;
        let fecha_desde = req.query.fecha_desde;
        let fecha_hasta = req.query.fecha_hasta;

        let results = {};
        let inasistencias = [];
        inasistencias = await Inasistencia.getAllInasistenciasWidthDate(user.mapa.get(username), fecha_desde, fecha_hasta);
        for (let index = 0; index < inasistencias.length; index++) {
            inasistencias[index].justificada == 0 ? inasistencias[index].justificada = 'Injustificada. ' : '';
            if (inasistencias[index].justificada == 1) {
                inasistencias[index].justificada = 'Justificada. ' + inasistencias[index].ina_just_fecha
                inasistencias[index].ina_injust_comment = inasistencias[index].ina_just_comment;
            }


        }
        results.inasistencias = inasistencias;
        results.fecha_desde = fecha_desde;
        results.fecha_hasta = fecha_hasta;
        results.usuario = usuario;
        //res.json(inasistencias);
        let obj = new genPdf;
        let pdf = await obj.getFicha(results, 'reporte_inasistencia_alumnos', true);
        res.type('application/pdf');
        res.end(pdf, 'binary');
    },
    generatePDFnovedades: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;

        let usuario = req.query.user;
        let fecha_desde = req.query.fecha_desde;
        let fecha_hasta = req.query.fecha_hasta;

        let results = {};
        let novedades = [];
        novedades = await Inasistencia.getAllNovedadesWidthDate(user.mapa.get(username), fecha_desde, fecha_hasta);

        for (let index = 0; index < novedades.length; index++) {
            novedades[index].nov_tipo == 1 ? novedades[index].nov_tipo = 'Otros' : novedades[index].tipo = 'Atraso';
            novedades[index].nov_tipo == 2 ? novedades[index].nov_tipo = 'Atraso' : novedades[index].tipo = 'Atraso';

        }

        results.novedades = novedades;
        results.fecha_desde = fecha_desde;
        results.fecha_hasta = fecha_hasta;
        results.usuario = usuario;

        let obj = new genPdf;
        let pdf = await obj.getFicha(results, 'reporte_novedades_alumnos', true);
        res.type('application/pdf');
        res.end(pdf, 'binary');
    },
    notificaciones: async (req, res) => {
        try {
            let user = req.app.locals.user;
            let username = user.username;
            let notificaciones = [];
            let detalleNotificaciones = await Notificaciones.getDetalle();
            //administrador o inspector general
            if (user.idrol == 1 || user.idrol == 42) {
                notificaciones = await Notificaciones.getAll(user.mapa.get(username));
            } else {
                notificaciones = await Notificaciones.getByIdIc(user.iduser, user.mapa.get(username));
            }
            //res.send(notificaciones)
            res.render('alumnos/notificaciones', {
                title: 'Notificaciones',
                notificaciones,
                detalleNotificaciones
            })
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información : ' + e));
        }
    },
    mover: async (req, res) => {

        let user = req.app.locals.user;
        let username = user.username;

        let ids = req.body.id_s;
        let cur_ant = req.body.cur_ant;
        let idcurso = req.body.idcurso;

        //res.send(req.body);

        //Ocurrio un error, TypeError: Cannot read property 'idmatricula' of undefined at mover(/Users/jeancarlostoaquezada / node / ue / ue / controllers / alumnosController.js: 254: 70) at process._tickCallback(internal / process / next_tick.js: 68: 7)
        if (ids) {
            try {

                for (let index = 0; index < ids.length; index++) {
                    let idmatricula = await Alumno.getMatricula(ids[index], user.mapa.get(username));

                    if (idmatricula.length > 0) {
                        try {
                            console.log('idmatricula =>' + idmatricula[0].idmatricula + ' idcurso =>' + idcurso + ' cur_ant=> ' + cur_ant);
                            let a = await Curso.cambiarCurso(idmatricula[0].idmatricula, idcurso, cur_ant);


                        } catch (error) {
                            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un error, ', error))
                        }

                    }

                }

                res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Ok.'))
            } catch (error) {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un error, ', error))
            }
        } else {
            res.redirect('back', req.flash('type', 'warning'), req.flash('message', 'Ningún alumno seleccionado.'))
        }
    },
    asignarCurso: async (req, res) => {
        if (!req.body.idalumno) {
            res.redirect('back', req.flash('type', 'warning'), req.flash('message', 'Por favor seleccióne los estudiantes'));
            return;
        }
        if (req.body.idalumno) {
            let user = req.app.locals.user;
            let username = user.username;
            let idcurso = req.body.idcurso;
            let cur_ant = req.body.cur_ant_agragar;
            let idalumnos = req.body.idalumno;
            try {
                for (let index = 0; index < idalumnos.length; index++) {
                    let verif = await Curso.verificarExistencia(idalumnos[index], idcurso, user.mapa.get(username))
                    if (verif.length > 0) {

                    } else {
                        await Curso.asignarAlumnos(idalumnos[index], idcurso, cur_ant, user.mapa.get(username));
                    }
                }
                res.redirect('back', req.flash('type', 'success'), req.flash('message', `Ok`));
            } catch (e) {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Ocurrio un error al registrar los alumnos, error: ', e));
            }


        }

    },
    findByCedula: async (req, res) => {
        try {
            let alumno = await Alumno.findByCedula(req.params.cedula);
            if (alumno.length > 0) {
                res.send(alumno[0]);
            } else {
                res.send(false);
            }
        } catch (e) {
            console.log(e);
        }

    },
    pdfFicha: async (req, res) => {
        /* 1 = inasistencias
           2 = novedades
           3 = notificaciones */
        let user = req.app.locals.user;
        let username = user.username;

        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;
        if (!fecha_hasta) {
            fecha_hasta = fecha_desde;
        }



        try {
            let tutor = [];
            //obtener datos del alumno 
            let alumno = await Alumno.findById(req.params.idalumno, user.mapa.get(username));
            //Obener tutor            
            if (alumno.length > 0) {
                let idcurso = alumno[0].idcurso;
                let tut = await Curso.findTutor(idcurso, user.mapa.get(username));
                if (tut.length > 0) {
                    tutor = tut[0];
                }
            }





            let results = {};
            for (let index = 0; index < req.body.op_visualizacion.length; index++) {

                switch (req.body.op_visualizacion[index]) {
                    case '1':
                        //inasistencias
                        let totalJustificadas = 0;
                        let totalInjustificadas = 0;
                        //results.inasistencias = await Inasistencia.findInasistenciaByIdWidthDate(req.params.idalumno, user.mapa.get(username), '');

                        inasistencias = await Inasistencia.findInasistenciaByIdWidthDate(req.params.idalumno, user.mapa.get(username), fecha_desde, fecha_hasta);
                        for (let index = 0; index < inasistencias.length; index++) {

                            if (inasistencias[index].justificada == 0) {
                                inasistencias[index].justificada = 'Inj.'
                                totalInjustificadas += 1;
                            } else {
                                inasistencias[index].justificada = 'Just. ' + inasistencias[index].ina_just_fecha;
                                inasistencias[index].ina_injust_comment = inasistencias[index].ina_just_comment;
                                totalJustificadas += 1;
                            }
                        }
                        results.inasistenciasTitulo = 'Inasistencias';
                        results.totalJustificadas = totalJustificadas;
                        results.totalInjustificadas = totalInjustificadas;
                        results.inasistencias = inasistencias;
                        break;
                    case '2':
                        //novedades

                        let novedades = await Inasistencia.findNovedadesByIdWidhDate(req.params.idalumno, user.mapa.get(username), fecha_desde, fecha_hasta);
                        for (let index = 0; index < novedades.length; index++) {
                            if (novedades[index].nov_tipo == 1) {
                                novedades[index].nov_tipo = 'Otros'
                            } else if (novedades[index].nov_tipo == 2) {
                                novedades[index].nov_tipo = 'Atraso'
                            }

                        }
                        results.novedadesTitulo = 'Novedades';
                        results.novedades = novedades;
                        break;
                    case '3':
                        console.log('notificaciones')
                        break;

                    default:
                        break;
                }
            }
            results.tutor = tutor;
            results.alumno = alumno[0];
            results.fecha_desde = fecha_desde;
            results.fecha_hasta = fecha_hasta;

            let obj = new genPdf;
            let pdf = await obj.getFicha(results, 'ficha', true);
            res.type('application/pdf');
            res.end(pdf, 'binary');
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al generar el PDF, error: ' + e.message));
        }
    },

    desactivarAlumno: async (req, res) => {
        let idalumno = req.params.idalumno;
        let nalumno = req.body.nalumno;
        try {
            let alumno = await db.query(`UPDATE alumno SET alu_estado = 0 WHERE idalumno = ?`, [idalumno]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', `El alumno fue deshabilitado.`));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al ejecutar la operación' + e.message));
        }
    },
    activarAlumno: async (req, res) => {
        let idalumno = req.params.idalumno;
        let nalumno = req.body.nalumno;
        try {
            let alumno = await db.query(`UPDATE alumno SET alu_estado = 1 WHERE idalumno = ?`, [idalumno]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', `El alumno fue habilitado.`));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al ejecutar la operación' + e.message));
        }
    },
    quitarAlumnoDelCurso: async (req, res) => {
        //res.send('asd');
        let idalumno = req.body.idalumno;
        let user = req.app.locals.user;
        let username = user.username;

        //res.send(req.body);
        try {
            let idmatricula = await db.query(`SELECT idmatricula FROM matricula WHERE alumno_idalumno = ${idalumno} AND mat_idanio_lectivo = ${user.mapa.get(username)} AND matr_estado`);
            //res.send(idmatricula);
            if (idmatricula.length > 0) {
                idmatricula = idmatricula[0];

                //await db.query(`UPDATE matricula SET matr_estado = 0 WHERE idmatricula = ?`, [idmatricula.idmatricula]);
                await db.query(`DELETE FROM matricula WHERE idmatricula = ?`, [idmatricula.idmatricula]);
                res.redirect('back', req.flash('type', 'success'), req.flash('message', `El alumno fue quitado del curso.`));

                /* ER_PARSE_ERROR: You have an error in your SQL syntax;
                check the manual that corresponds to your MySQL server version
                for the right syntax to use near '112 AND mat_idanio_lectivo = 2 AND matr_estado'
                at line 1 */
            }

            res.redirect('back', req.flash('type', 'info'), req.flash('message', `La operación no se ejecuto`));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al ejecutar la operación' + e.message));
        }

    }
}