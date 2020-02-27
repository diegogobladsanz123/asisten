let Notificacion = require('../models/notificacionModel');
let Asunto = require('../models/asuntoModel');
let db = require('../databaes');

let genPdf = require('../controllers/genPdf');

module.exports = {
    index: (req, res) => {
        res.send('notificacion');
    },
    store: async (req, res) => {
        try {
            let user = req.app.locals.user;
            let username = user.username;



            let notificacion = new Notificacion(
                req.body.not_fecha,
                req.body.alumno_idalumno,
                req.body.not_curso,
                req.body.not_tutor,
                user.iduser,
                user.fullname,
                user.mapa.get(username),
                req.body.not_fecha_presentacion
            );
            let sql1 = await Notificacion.save(notificacion);
            //let sql1 = DB.query('INSERT INTO notificaciones SET ?', [Notificacion]);


            for (let index = 0; index < req.body.nov_asunto.length; index++) {
                let asunto = new Asunto(req.body.nov_asunto[index], sql1.insertId);
                await Asunto.save(asunto);
            }

            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'La notificación fue registrada.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar la notificación, error: ' + e.message));
        }
    },
    delete: async (req, res) => {
        try {
            //await Notificacion.delete(req.params.id);
            let user = req.app.locals.user;
            db.query(`UPDATE notificaciones SET not_estado = 0, updated_fullname = ?, del_comment = ? WHERE idnotificaciones = ?`, [user.fullname, req.body.del_comment, req.params.id]);

            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Notificación eliminada.'));
        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al eliminar la notificación, error: ' + e.message));
        }
    },
    getNotificacion: async (req, res) => {

        try {
            let data = await db.query(`
            SELECT
            notificaciones.idnotificaciones,
                notificaciones.not_fecha,
                notificaciones.not_fecha_presentacion,
                alumno.alu_representante_nombres,
                alumno.alu_apellidos_nombres,
                notificaciones.not_curso,
                notificaciones.not_tutor,
                not_asunto.not_asunto,
                not_asunto.idnot_asunto
            FROM
            not_asunto
            JOIN notificaciones ON not_asunto.notificaciones_idnotificaciones = notificaciones.idnotificaciones
            JOIN alumno ON notificaciones.alumno_idalumno = alumno.idalumno
            WHERE
            notificaciones.idnotificaciones = ${req.params.id}
            `);



            let dt = {};



            if (data.length > 0) {
                dt.idnotificaciones = data[0].idnotificaciones;
                dt.not_fecha = data[0].not_fecha;
                dt.not_fecha_presentacion = data[0].not_fecha_presentacion;
                dt.alu_representante_nombres = data[0].alu_representante_nombres;
                dt.alu_apellidos_nombres = data[0].alu_apellidos_nombres;
                dt.not_curso = data[0].not_curso;
                dt.not_tutor = data[0].not_tutor;
                dt.asunto = [];
                dt.asunto = data.map((item) => {
                    return {
                        id: item.idnot_asunto,
                        not_asunto: item.not_asunto
                    }
                })



            }


            let obj = new genPdf;
            let pdf = await obj.getNotificacion(dt, 'notificacion');
            res.type('application/pdf');
            res.end(pdf, 'binary');

        } catch (error) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la notificación, error: ' + error.message));

        }


    }


}