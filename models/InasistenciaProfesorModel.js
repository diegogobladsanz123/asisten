let db = require('../databaes');
class InasistenciaProfesor {
    constructor(ina_tipo, idprofresor, ina_fecha, ina_hora, idic, idmaterias, mat_nombre, idcurso, cur_curso, injustificado_coment, justificado_coment, user_fullname, idanio_lectivo) {

        this.ina_tipo = ina_tipo;
        this.idprofesor = idprofresor;
        this.ina_fecha = ina_fecha;
        this.ina_hora = ina_hora;
        this.idic = idic;
        this.idmaterias = idmaterias;
        this.mat_nombre = mat_nombre;
        this.idcurso = idcurso;
        this.cur_curso = cur_curso;
        this.injustificado_coment = injustificado_coment;
        this.justificado_coment = justificado_coment;
        this.user_fullname = user_fullname;
        this.idanio_lectivo = idanio_lectivo;
    }
    static getAll() {
        return db.query(`SELECT * FROM inasistencia_profesor WHERE ina_estado = 1`);
    }
    static save(InasistenciaProfesor) {
        return db.query(`INSERT INTO inasistencia_profesor SET ? `, [InasistenciaProfesor]);
    }
    static delete(id, comentario, user_fullname) {
        return db.query(`UPDATE inasistencia_profesor SET ina_estado = 0, eliminado_coment = ?, updated_fullname = ? WHERE idinasistencia_profesor = ? `, [comentario, user_fullname, id]);
    }
    static justificar(id, justificado_coment, justificado_fecha, updated_fullname) {
        return db.query(`UPDATE inasistencia_profesor SET 
        justificado = 1, justificado_coment = ? , justificado_fecha = ? , updated_fullname = ? WHERE idinasistencia_profesor = ? `, [justificado_coment, justificado_fecha, updated_fullname, id]);
    }

    static getByIdAndDate(iduser, idanio_lectivo, fecha_desde, fecha_hasta) { //Get inasistencias por inspectores de curso, para presentar a IG y Admin
        return 
    }
}
module.exports = InasistenciaProfesor;