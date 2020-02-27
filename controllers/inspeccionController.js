let db = require('../databaes');
let Materia = require('../models/materiaModel');
let Inasistencia = require('../models/inasistenciaModel');
let Mhc = require('../models/mhcModel');
let funcionario = require('../models/funcinarioModel');
let Inspector = require('../models/inspectorModel');
let Curso = require('../models/cursoModel');
let Alumno = require('../models/alumnoModel');
let User = require('../models/userModel');
let genPDFPDF = require('../controllers/genPdf');
let dateFormat = require('dateformat');
module.exports = {
    index: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;

        if (req.app.locals.user.idrol != 1) {
            //escritorio del inspector de curso.        
            res.redirect('/profesores');
        }
        try {
            //panel administrador      
            //obtener todos los inspectores correspondientes al anio lectivo seleccionado
            let ins2 = await Inspector.getAllIc(user.mapa.get(username));
            let insg = await Inspector.getAllIg(user.mapa.get(username));

            function eliminarObjetosDuplicados(arr, prop) {
                var nuevoArray = [];
                var lookup = {};
                for (var i in arr) {
                    lookup[arr[i][prop]] = arr[i];
                }
                for (i in lookup) {
                    nuevoArray.push(lookup[i]);
                }

                return nuevoArray;
            }
            ins = eliminarObjetosDuplicados(ins2, 'iduser');
            insgg = eliminarObjetosDuplicados(insg, 'iduser');
            //ins = [];
            //
            //cursos con inspector
            let cci = await Curso.getCursoConIC(user.mapa.get(username));
            //todos los cursos
            let cursos = await Curso.getAll();
            //res.send(cursos)
            //console.log(cci)
            //extraer cursos sin inspector


            for (let i = 0; i < cci.length; i++) {

                cursos.find((item, index) => {
                    if (item.idcurso == cci[i].idcurso) {
                        return cursos.splice(index, 1);
                    }
                })

            }
            let csi = cursos;
            let ig = [];

            //obtener todos los usuarios con rol de inspectores de curso
            let row = await User.getAll2(user.mapa.get(username)); //IC
            let row3 = await User.getAll3(user.mapa.get(username)); //IG
            res.render('configuracion/inspeccion/index', {
                title: 'Inspección',
                ins,
                csi,
                cci,
                ig,
                row,
                insgg,
                row3
            });
        } catch (e) {
            console.log(e);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, mensaje: ' + e.message));
        }
    },
    /* TODO: Methods for IC */
    setInspector: async (req, res) => {

        try {
            let user = req.app.locals.user;
            let username = user.username;
            //user.mapa.get(username)
            let ins = new Inspector(2, req.body.idcurso, req.body.iduser, user.mapa.get(username));
            //await db.query('UPDATE curso SET user_iduser = ? WHERE idcurso = ?', [req.params.iduser, req.body.idcurso]);
            await Inspector.save(ins);

            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Curso asignado'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error, mensaje: ${e.message}`));
        }
    },
    setInspectorGeneral: async (req, res) => {
        let iduser = req.body.iduser;
        try {
            let user = req.app.locals.user;
            let username = user.username;
            //user.mapa.get(username)
            let ins = new Inspector(1, null, iduser, user.mapa.get(username));
            //await db.query('UPDATE curso SET user_iduser = ? WHERE idcurso = ?', [req.params.iduser, req.body.idcurso]);
            await Inspector.save(ins);

            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Inspector registrado'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error, mensaje: ${e.message}`));
        }

    },
    unSetInspector: async (req, res) => {

        try {
            await Inspector.unSetInspector(req.params.idinspector);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'ok.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error, mensaje: ${e.message}`));
        }
    },
    getCursosForIc: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;
        try {
            /*  let cci = await db.query(`
             SELECT
                 *
             FROM
                 curso
             INNER JOIN
                 nivel on nivel.idnivel = curso.nivel_idnivel
             WHERE
                 user_iduser = ?
             AND
                 cur_estado =1`, [user.iduser]); */


            let cci = await Curso.getCursosForIc(user.iduser, user.mapa.get(username));

            res.render('configuracion/inspeccion/ic/index.hbs', {
                title: 'Inspector de curso',
                idfuncionario: req.params.idfuncionario,
                cci: cci
            });
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error, mensaje: ${e.message}`));
        }
    },
    getAlumnos: async (req, res) => {

        //let materias = await Materia.findByCurso(req.params.idcurso);
        let materias = [];
        let user = req.app.locals.user;
        let username = user.username;

        let now = new Date();
        try {
            /* let listt = await db.query(`
            SELECT 
                idalumno,
                alu_cedula,
                alu_apellidos_nombres, 
                user_iduser, 
                cur_curso 
            FROM 
                alumno
            INNER JOIN 
                matricula on alumno.idalumno = matricula.alumno_idalumno
            INNER JOIN 
                curso on curso.idcurso =  matricula.curso_idcurso
            WHERE 
                matr_estado = 1
            AND
                curso_idcurso = ?`, [req.params.idcurso]); */

            let list = await Alumno.findByCurso(req.params.idcurso, user.mapa.get(username));
            //console.log('idcurso => ', req.params.idcurso, ' anio_lectivo =>', )

            if (list.length < 1) {
                return res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'El curso no tiene alumnos matriculados'));
            }
            let materias = await Materia.findByCurso(req.params.idcurso, user.mapa.get(username));

            res.render('configuracion/inspeccion/ic/alumnos', {
                title: 'Listado de alumnos',
                idfuncionario: req.params.idfuncionario,
                list: list,
                materias,
                curso: list[0].cur_curso
            });
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', `Error, mensaje: ${e}`));
        }
    },
    setFalta: async (req, res) => {

        let idmateriass = req.body.materias_has_curso_idmaterias_has_curso;
        let curso = req.body.curso;
        let materias = req.body.materia;
        let horas = req.body.horas;
        let comentario = req.body.ina_injust_comment;
        let user = req.app.locals.user;
        let username = user.username;


        for (let index = 0; index < idmateriass.length; index++) {
            let mhc = await Mhc.findOrFail(idmateriass[index]);

            if (mhc.length > 0) {
                var profesor = await funcionario.findById(mhc[0].profesor_idprofesor);
                var idmaterias = mhc[0];
            } else {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'ocurrio un error'));
            }


            try {
                let inn = new Inasistencia(
                    req.body.ina_fecha, //
                    comentario[index], //
                    req.body.alumno_idalumno, //
                    idmaterias.materias_idmaterias,
                    curso,
                    materias[index], //materia
                    profesor[0].fun_nombres, //
                    user.iduser,
                    user.fullname,
                    user.mapa.get(username)
                );

                for (let i = 0; i < horas[index]; i++) {

                    await Inasistencia.save(inn);
                }



            } catch (e) {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar la falta, mensaje: ' + e.message));
            }

        }
        res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Inasistencia registrada.'));



    },
    justFalta: async (req, res) => {

        try {
            let user = req.app.locals.user;
            await db.query(`UPDATE inasistencia set 
            justificada = 1,
            ina_just_fecha = ?,
            ina_just_comment = ?,
            updated_fullname = ?
            WHERE idinasistencia = ? `, [req.body.ina_just_fecha, req.body.ina_just_comment, user.fullname, req.body.idinasistencia]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Inasistencia justificada.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar la falta, mensaje: ' + e.message));
        }
    },
    delFalta: async (req, res) => {
        try {
            let user = req.app.locals.user;
            let obj = await db.query('UPDATE inasistencia set ina_estado = 0, updated_fullname = ?, del_comment = ? WHERE idinasistencia = ?', [user.fullname, req.body.del_comment, req.body.idinasistencia]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Registro eliminado.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar la falta, mensaje: ' + e.message));
        }
    },
    //*NOVEDADES */
    setNovedad: async (req, res) => {


        try {
            let user = req.app.locals.user;
            let username = user.username;
            await db.query(`INSERT INTO novedad (not_curso,nov_asunto,nov_fecha,nov_tipo,alumno_idalumno, user_iduser,nov_materia, user_fullname, idanio_lectivo) VALUES (?,?,?,?,?,?,?,?,?)`,
                [req.body.not_curso, req.body.nov_asunto, req.body.nov_fecha, req.body.nov_tipo, req.body.alumno_idalumno, req.app.locals.user.iduser, req.body.nov_materia, user.fullname, user.mapa.get(username)]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'La novedad fue registrada.'));
        } catch (e) {

            /* Error al registrar, error: ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ' nov_tipo = '2019 - 07 - 22', alumno_idalumno = '2', ' at line 2 */
            console.log(e)
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar, error: ' + e.message));
        }
    },
    delNovedad: async (req, res) => {
        try {
            let user = req.app.locals.user;
            await db.query('UPDATE novedad set nov_state = 0, del_comment = ?, updated_fullname = ? WHERE idnovedad = ?', [req.body.del_comment, user.fullname, req.body.idnovedad]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Novedad eliminada'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al eliminar, error: ' + e.message));
        }
    },
    /*END Methods for IC */

    getIc: async (req, res) => {

        let user = req.app.locals.user;
        let username = user.username;
        let ic = await Inspector.getAllIc(user.mapa.get(username));
        let inasistencias = [];
        let genpdf;
        let iduser;
        let fecha_desde = dateFormat(new Date(), 'yyyy-mm-dd');
        let fecha_hasta = dateFormat(new Date(), 'yyyy-mm-dd');

        let idic;



        function eliminarObjetosDuplicados(arr, prop) {
            var nuevoArray = [];
            var lookup = {};
            for (var i in arr) {
                lookup[arr[i][prop]] = arr[i];
            }
            for (i in lookup) {
                nuevoArray.push(lookup[i]);
            }

            return nuevoArray;
        }
        ic = eliminarObjetosDuplicados(ic, 'iduser');

        if (req.query.iduser) {
            req.query.iduser != undefined ? idic = req.query.iduser : idic;
            iduser = req.query.iduser;
            req.query.fecha_desde != undefined ? fecha_desde = req.query.fecha_desde : fecha_desde;
            req.query.fecha_hasta != undefined ? fecha_hasta = req.query.fecha_hasta : fecha_hasta = fecha_desde;
            //var fecha_desde = req.query.fecha_desde;
            /* var fecha_hasta = req.query.fecha_hasta;
            if (!fecha_hasta) {
                fecha_hasta = fecha_desde;
            } */
            let user = req.app.locals.user;
            let username = user.username;
            var icc = await User.findOrFail(iduser);

            icc.length > 0 ? icc = icc[0].fullname : '_';
            icc.length > 0 ? genpdf = 'si' : '';
            //as
            try {
                inasistencias = await db.query(`
           SELECT
               inasistencia_profesor.*,
               funcionario.*
               FROM
           inasistencia_profesor
           JOIN funcionario ON inasistencia_profesor.idprofesor = funcionario.idfuncionario
           WHERE
           inasistencia_profesor.idic = ?           
           AND inasistencia_profesor.ina_fecha BETWEEN '${fecha_desde}' AND '${fecha_hasta}' 
           AND inasistencia_profesor.idanio_lectivo = ? `, [iduser, user.mapa.get(username)]);

            } catch (error) {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error, error: ' + error.message));
            }
        }



        res.render('configuracion/inspeccion/registro_asistencia.hbs', {
            title: 'Registro de novedades',
            ic,
            inasistencias,
            fecha_desde,
            fecha_hasta,
            icc,
            genpdf,
            iduser,
            idic

        });
    },
    reportePDF: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;
        let results = {};
        try {
            let inasistencias = await db.query(`
           SELECT
               inasistencia_profesor.*,
               funcionario.*
               FROM
           inasistencia_profesor
           JOIN funcionario ON inasistencia_profesor.idprofesor = funcionario.idfuncionario
           WHERE
           inasistencia_profesor.idic = ?           
           AND inasistencia_profesor.ina_fecha BETWEEN '${req.query.fecha_desde}' AND '${req.query.fecha_hasta}' 
           AND inasistencia_profesor.idanio_lectivo = ?
           AND ina_estado = 1`, [req.query.iduser, user.mapa.get(username)]);

            if (inasistencias.length > 0) {
                for (let index = 0; index < inasistencias.length; index++) {
                    inasistencias[index].ina_tipo == '1' ? inasistencias[index].ina_tipo = 'F.D' : '';
                    inasistencias[index].ina_tipo == '2' ? inasistencias[index].ina_tipo = 'F.H' : '';
                    inasistencias[index].ina_tipo == '3' ? inasistencias[index].ina_tipo = 'A' : '';

                    if (inasistencias[index].justificado == '1') {
                        inasistencias[index].estadoo = `Justificada. ${inasistencias[index].justificado_fecha}`
                        inasistencias[index].motivo = inasistencias[index].justificado_coment;
                    } else {
                        inasistencias[index].estadoo = 'Injustificada.'
                        inasistencias[index].motivo = inasistencias[index].injustificado_coment
                    }



                }
            }

            results.ic = req.query.ic;
            results.username = req.app.locals.user.fullname;
            results.fecha_desde = req.query.fecha_desde;
            results.fecha_hasta = req.query.fecha_hasta;
            results.inasistencias = inasistencias;
            let obj = new genPDFPDF;
            let pdf = await obj.getFicha(results, 'reporte_novedades_por_ic', true);
            res.type('application/pdf');
            res.end(pdf, 'binary');
        } catch (e) {

            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al generar PDF, Error: ', e.message));
        }


    },
    ReportePdfDocente: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;
        let results = {};
        try {
            let inasistencias = await db.query(`
           SELECT
               inasistencia_profesor.*,
               funcionario.*
               FROM
           inasistencia_profesor
           JOIN funcionario ON inasistencia_profesor.idprofesor = funcionario.idfuncionario
           WHERE
           inasistencia_profesor.idprofesor = ?           
           AND inasistencia_profesor.ina_fecha BETWEEN '${req.query.fecha_desde}' AND '${req.query.fecha_hasta}' 
           AND inasistencia_profesor.idanio_lectivo = ?
           AND ina_estado = 1`, [req.query.iduser, user.mapa.get(username)]);

            if (inasistencias.length > 0) {
                for (let index = 0; index < inasistencias.length; index++) {
                    inasistencias[index].ina_tipo == '1' ? inasistencias[index].ina_tipo = 'F.D' : '';
                    inasistencias[index].ina_tipo == '2' ? inasistencias[index].ina_tipo = 'F.H' : '';
                    inasistencias[index].ina_tipo == '3' ? inasistencias[index].ina_tipo = 'A' : '';

                    if (inasistencias[index].justificado == '1') {
                        inasistencias[index].estadoo = `Justificada. ${inasistencias[index].justificado_fecha}`
                        inasistencias[index].motivo = inasistencias[index].justificado_coment;
                    } else {
                        inasistencias[index].estadoo = 'Injustificada.'
                        inasistencias[index].motivo = inasistencias[index].injustificado_coment
                    }



                }
            }

            results.ic = req.query.ic;
            results.username = req.app.locals.user.fullname;
            results.fecha_desde = req.query.fecha_desde;
            results.fecha_hasta = req.query.fecha_hasta;
            results.inasistencias = inasistencias;
            let obj = new genPDFPDF;
            let pdf = await obj.getFicha(results, 'reporte_novedades_por_docente', true);
            res.type('application/pdf');
            res.end(pdf, 'binary');
        } catch (e) {

            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al generar PDF, Error: ', e.message));
        }
    },
    getInasistenciasByIc: async (req, res) => { //Get inasistencias por inspectores de curso, para presentar a IG y Admin

        let iduser = req.query.iduser;
        let fecha_desde = req.query.fecha_desde;
        let fecha_hasta = req.query.fecha_hasta;
        let user = req.app.locals.user;
        let username = user.username;
        let ic = await User.findOrFail(iduser);

        //console.log('iduser => ', iduser, ' fecha_desde =>', fecha_desde, ' fecha_hasta =>', fecha_hasta)
        //console.log('idanio_lectivo => ', user.mapa.get(username))
        ic.length > 0 ? ic = ic[0].fullname : '';

        try {
            let inasistencias = await db.query(`
           SELECT
           inasistencia_profesor.*,
               funcionario.*
               FROM
           inasistencia_profesor
           JOIN funcionario ON inasistencia_profesor.idprofesor = funcionario.idfuncionario
           WHERE
           inasistencia_profesor.idic = ?           
           AND inasistencia_profesor.ina_fecha BETWEEN '${fecha_desde}' AND '${fecha_hasta}' 
           AND inasistencia_profesor.idanio_lectivo = ? `, [iduser, user.mapa.get(username)]);
            //res.send(inasistencias);
            //console.log(inasistencias);
            res.render('configuracion/inspeccion/viewInasistencia', {
                title: 'Docentes - Reporte de novedades',
                inasistencias,
                fecha_desde,
                fecha_hasta,
                ic

            })

        } catch (error) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error, error: ' + error.message));
        }



    },
    registro_asistencia_docente: async (req, res) => {
        let user = req.app.locals.user;
        let username = user.username;
        let inasistencias = [];
        let funcio = [];
        let fecha_desde = '';
        let fecha_hasta = '';
        let genpdf;
        let iduser;
        let icc;
        inasistencias = [];


        try {
            let func = await funcionario.getAll();

            if (req.query.iduser) {
                iduser = req.query.iduser;
                //fechas
                fecha_desde = req.query.fecha_desde;
                fecha_hasta = req.query.fecha_hasta;
                if (!fecha_hasta) {
                    fecha_hasta = fecha_desde;
                }

                sql = await funcionario.findById(req.query.iduser);
                if (sql.length > 0) {
                    funcio = sql[0];
                    genpdf = 'si';
                    icc = sql[0].fun_nombres;
                }
                inasistencias = await db.query(`
           SELECT
               inasistencia_profesor.*,
               funcionario.*
               FROM
           inasistencia_profesor
           JOIN funcionario ON inasistencia_profesor.idprofesor = funcionario.idfuncionario
           WHERE
           inasistencia_profesor.idprofesor = ?           
           AND inasistencia_profesor.ina_fecha BETWEEN '${fecha_desde}' AND '${fecha_hasta}' 
           AND inasistencia_profesor.idanio_lectivo = ? `, [req.query.iduser, user.mapa.get(username)]);
            }
            //console.log('inasistencias =>', inasistencias)

            res.render('configuracion/inspeccion/viewInasistenciaDocente', {
                title: 'Consultar por docente',
                func,
                fecha_desde,
                fecha_hasta,
                funcio,
                inasistencias,
                genpdf,
                iduser,
                icc

            });
        } catch (error) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error, error: ' + error.message));
        }

    }



}