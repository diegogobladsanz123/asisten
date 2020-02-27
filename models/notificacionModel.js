var db = require('../databaes');
class Notificacion {
    constructor(not_fecha, alumno_idalumno, not_curso, not_tutor, user_iduser, fullname, idanio_lectivo, not_fecha_presentacion) {
        this.not_fecha = not_fecha;
        this.alumno_idalumno = alumno_idalumno;
        this.not_curso = not_curso;
        this.not_tutor = not_tutor;
        this.not_tutor = not_tutor;
        this.user_iduser = user_iduser;
        this.user_fullname = fullname;
        this.idanio_lectivo = idanio_lectivo;
        this.not_fecha_presentacion = not_fecha_presentacion;
    }
    static save(Notificacion, fullname) {
        return db.query('INSERT INTO notificaciones SET ?', [Notificacion]);
    }
    static getAll(idanio_lectivo) {
        return db.query(`SELECT 
        idnotificaciones,
        not_tutor,
        not_curso,
        not_fecha,        
        idalumno,
        not_estado,
        alu_apellidos_nombres,
        user_fullname,
        updated_fullname,
        user_iduser,
        del_comment
        FROM notificaciones
        INNER JOIN alumno on alumno.idalumno = notificaciones.alumno_idalumno
        WHERE
        notificaciones.idanio_lectivo = ?
        
        `, [idanio_lectivo]);
    }
    static getByIdIc(iduser, idanio_lectivo) {

        return db.query(`
        SELECT
        notificaciones.not_curso,
            notificaciones.not_tutor,
            alumno.idalumno,
            alumno.alu_apellidos_nombres,
            notificaciones.not_estado,
            notificaciones.idnotificaciones,
            notificaciones.user_iduser,
            notificaciones.user_fullname,
            notificaciones.del_comment,
            notificaciones.updated_fullname,
            notificaciones.not_fecha
        FROM
        matricula
        JOIN alumno ON matricula.alumno_idalumno = alumno.idalumno
        JOIN curso ON matricula.curso_idcurso = curso.idcurso
        JOIN notificaciones ON notificaciones.alumno_idalumno = alumno.idalumno
        WHERE
        matricula.matr_estado = 1
        AND notificaciones.user_iduser = ?
        AND notificaciones.idanio_lectivo = ?
        `, [iduser, idanio_lectivo]);
    }
    static getAllById(id, idanio_lecltivo) {
        return db.query(`
        SELECT
            *
        FROM
            notificaciones
        INNER JOIN
            alumno on alumno.idalumno = notificaciones.alumno_idalumno
        WHERE
            alumno_idalumno= ?
        AND
            notificaciones.idanio_lectivo = ?`, [id, idanio_lecltivo]);

    }
    static delete(id) {
        return db.query('UPDATE notificaciones SET not_estado = 0 WHERE idnotificaciones = ?', [id]);
    }
    static getDetalle() {
        return db.query('SELECT * FROM not_asunto');
    }
}


module.exports = Notificacion;