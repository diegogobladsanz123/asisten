let db = require('../databaes');
class Inasistencia {
    constructor(
        ina_fecha,
        ina_injust_comment,
        alumno_idalumno,
        materias_idmaterias,
        curso,
        materia,
        profesor,
        user_iduser,
        user_fullname,
        idanio_lectivo
    ) {
        this.ina_fecha = ina_fecha;
        this.ina_injust_comment = ina_injust_comment;
        this.alumno_idalumno = alumno_idalumno;
        this.materias_idmaterias = materias_idmaterias;
        this.curso = curso;
        this.materia = materia;
        this.profesor = profesor;
        this.user_iduser = user_iduser;
        this.user_fullname = user_fullname;
        this.idanio_lectivo = idanio_lectivo;
    }

    static save(Inasistencia) {

        //console.log(Inasistencia)
        return db.query('INSERT INTO inasistencia set ? ', [Inasistencia]);
    }

    static getAllInasistenciasByIdUser(iduser, idanio_lectivo) {
        //asistencia por alumno,


        return db.query(`
        SELECT
           alumno.alu_cedula,
           alumno.alu_apellidos_nombres,
           alumno.idalumno,                      
           inasistencia.curso,
           inasistencia.materia,
           inasistencia.profesor,
           inasistencia.user_iduser,           
           inasistencia.ina_fecha,
           inasistencia.justificada,           
           inasistencia.idinasistencia,
           inasistencia.ina_estado,
           inasistencia.ina_just_fecha,
           inasistencia.ina_injust_comment,
           inasistencia.ina_just_comment,
           inasistencia.user_fullname,
           inasistencia.updated_fullname,
           inasistencia.del_comment
       FROM
       inasistencia
       JOIN alumno ON inasistencia.alumno_idalumno = alumno.idalumno      
       WHERE           
        inasistencia.idanio_lectivo = ? 
        AND
        inasistencia.user_iduser = ? 
       
       
        `, [idanio_lectivo, iduser]);
        //curso.idcurso,


    }
    static getAllInasistencias(idanio_lectivo) {
        return db.query(`SELECT                                              
                        curso,
                        alu_apellidos_nombres,
                        materia,
                        ina_fecha,
                        justificada,
                        idalumno,
                        idinasistencia,
                        ina_estado,
                        ina_just_fecha,
                        ina_just_comment,
                        ina_injust_comment,
                        inasistencia.user_iduser,
                        user_fullname,
                        updated_fullname,
                        del_comment
                        FROM inasistencia                         
                        INNER JOIN alumno on alumno.idalumno = inasistencia.alumno_idalumno                        
                        WHERE inasistencia.idanio_lectivo = ?                        
                        ORDER BY idinasistencia DESC
                        
        `, [idanio_lectivo]);
    }
    static getAllInasistenciasWidthDate(idanio_lectivo, fecha_desde, fecha_hasta) {
        return db.query(`SELECT                                              
                        curso,
                        alu_apellidos_nombres,
                        materia,
                        ina_fecha,
                        justificada,
                        idalumno,
                        idinasistencia,
                        ina_estado,
                        ina_just_fecha,
                        ina_just_comment,
                        ina_injust_comment,
                        inasistencia.user_iduser,
                        user_fullname,
                        updated_fullname,
                        del_comment
                        FROM inasistencia                         
                        INNER JOIN alumno on alumno.idalumno = inasistencia.alumno_idalumno                        
                        WHERE inasistencia.idanio_lectivo = ?
                        AND ina_fecha BETWEEN '${fecha_desde}' AND '${fecha_hasta}'                        
                        ORDER BY idinasistencia DESC
                        
        `, [idanio_lectivo]);
    }
    static getAllNovedades(idanio_lecivo) {
        //nov - admin - ig -acceso directo
        return db.query(`
     SELECT
     novedad.idnovedad,
         novedad.nov_asunto,
         novedad.nov_fecha,
         novedad.nov_tipo,
         alumno.idalumno,
         novedad.user_iduser,
         novedad.nov_state,
         novedad.nov_materia,
         alumno.alu_apellidos_nombres,
         novedad.user_fullname,
         novedad.updated_fullname,
         novedad.del_comment,
         novedad.not_curso
     FROM
     novedad
     JOIN alumno ON novedad.alumno_idalumno = alumno.idalumno
     WHERE 
        novedad.idanio_lectivo = ?
        `, [idanio_lecivo]);
    }
    static getAllNovedadesWidthDate(idanio_lecivo, fecha_desde, fecha_hasta) {
        //nov - admin - ig -acceso directo
        return db.query(`
     SELECT
     novedad.idnovedad,
         novedad.nov_asunto,
         novedad.nov_fecha,
         novedad.nov_tipo,
         alumno.idalumno,
         novedad.user_iduser,
         novedad.nov_state,
         novedad.nov_materia,
         alumno.alu_apellidos_nombres,
         novedad.user_fullname,
         novedad.updated_fullname,
         novedad.del_comment,
         novedad.not_curso
     FROM
     novedad
     JOIN alumno ON novedad.alumno_idalumno = alumno.idalumno
     WHERE 
     novedad.idanio_lectivo = ?
     AND novedad.nov_fecha BETWEEN '${fecha_desde}' AND '${fecha_hasta}'`, [idanio_lecivo]);
    }
    static getAllNovedadesByIc(iduser, idanio_lecivo) {
        //nov - ic - acceso directo
        return db.query(`
        SELECT
            novedad.idnovedad,
            novedad.not_curso,
            novedad.nov_asunto,
            novedad.nov_fecha,
            novedad.nov_tipo,
            alumno.idalumno,
            novedad.user_iduser,
            novedad.nov_state,
            novedad.nov_materia,
            alumno.alu_apellidos_nombres,
            novedad.user_fullname,
            novedad.updated_fullname,
            novedad.del_comment            
        FROM
        novedad
        JOIN alumno ON alumno.idalumno = novedad.alumno_idalumno        
        WHERE
            novedad.idanio_lectivo = ?
        AND 
            novedad.user_iduser = ?
        
        `, [idanio_lecivo, iduser]);

    }
    static findNovedadesById(id, idanio_lectivo) {
        //for ficha
        return db.query(`
        SELECT
        matricula.matr_estado,
            novedad.idnovedad,
            novedad.nov_asunto,
            novedad.nov_fecha,
            novedad.nov_tipo,
            alumno.idalumno,
            novedad.user_iduser,
            novedad.nov_state,
            novedad.nov_materia,
            alumno.alu_apellidos_nombres,
            novedad.user_fullname,
            novedad.updated_fullname,
            novedad.del_comment,
            curso.cur_curso
        FROM
        matricula
        JOIN alumno ON matricula.alumno_idalumno = alumno.idalumno
        JOIN curso ON matricula.curso_idcurso = curso.idcurso
        JOIN novedad ON novedad.alumno_idalumno = alumno.idalumno
        WHERE
        matricula.matr_estado = 1
        AND alumno.idalumno = ?
        AND matricula.mat_idanio_lectivo = ?
        AND novedad.idanio_lectivo = ?
        `, [id, idanio_lectivo, idanio_lectivo]);
    }
    static findNovedadesByIdWidhDate(id, idanio_lectivo, fecha_desde, fecha_hasta) {
        //for ficha
        return db.query(`
        SELECT
        matricula.matr_estado,
            novedad.idnovedad,
            novedad.nov_asunto,
            novedad.nov_fecha,
            novedad.not_curso,
            novedad.nov_tipo,
            alumno.idalumno,
            novedad.user_iduser,
            novedad.nov_state,
            novedad.nov_materia,
            alumno.alu_apellidos_nombres,
            novedad.user_fullname,
            novedad.updated_fullname,
            novedad.del_comment,
            curso.cur_curso
        FROM
        matricula
        JOIN alumno ON matricula.alumno_idalumno = alumno.idalumno
        JOIN curso ON matricula.curso_idcurso = curso.idcurso
        JOIN novedad ON novedad.alumno_idalumno = alumno.idalumno
        WHERE
        matricula.matr_estado = 1
        AND alumno.idalumno = ?
        AND matricula.mat_idanio_lectivo = ?
        AND novedad.idanio_lectivo = ?
        AND nov_fecha BETWEEN '${fecha_desde}' AND '${fecha_hasta}'
        AND nov_state = 1
        `, [id, idanio_lectivo, idanio_lectivo]);
    }
    static findNovedadesByIdAndIdUser(id, iduser) {
        return db.query(`SELECT * FROM novedad 
        INNER JOIN alumno on alumno.idalumno = novedad.alumno_idalumno
        WHERE idalumno = ? AND user_iduser = ?`, [id, iduser]);
    }
    //for ficha byId
    static findInasistenciaById(id, idanio_lectivo) {
        return db.query(`SELECT 
                        idcurso,
                        cur_curso,
                        alu_apellidos_nombres,
                        materia,
                        ina_fecha,
                        justificada,
                        idalumno,
                        idinasistencia,
                        ina_estado,
                        ina_just_fecha,
                        ina_just_comment,
                        ina_injust_comment,
                        inasistencia.user_iduser,                       
                        inasistencia.user_fullname,                       
                        inasistencia.updated_fullname,                       
                        inasistencia.del_comment                    
                        FROM inasistencia                         
                        INNER JOIN alumno on alumno.idalumno = inasistencia.alumno_idalumno
                        INNER JOIN matricula on matricula.alumno_idalumno = alumno.idalumno
                        INNER JOIN curso on curso.idcurso = matricula.curso_idcurso
                        WHERE idalumno = ?
                        AND matricula.mat_idanio_lectivo = ?
                        AND inasistencia.idanio_lectivo = ?
                        
        `, [id, idanio_lectivo, idanio_lectivo]);
    }
    static findInasistenciaByIdWidthDate(id, idanio_lectivo, fecha_desde, fecha_hasta) {
        return db.query(`SELECT 
                        idcurso,
                        cur_curso,
                        curso,
                        alu_apellidos_nombres,
                        materia,
                        ina_fecha,
                        justificada,
                        idalumno,
                        idinasistencia,
                        ina_estado,
                        ina_just_fecha,
                        ina_just_comment,
                        ina_injust_comment,
                        inasistencia.user_iduser,                       
                        inasistencia.user_fullname,                       
                        inasistencia.updated_fullname,                       
                        inasistencia.del_comment                    
                        FROM inasistencia                         
                        INNER JOIN alumno on alumno.idalumno = inasistencia.alumno_idalumno
                        INNER JOIN matricula on matricula.alumno_idalumno = alumno.idalumno
                        INNER JOIN curso on curso.idcurso = matricula.curso_idcurso
                        WHERE idalumno = ?
                        AND matricula.mat_idanio_lectivo = ?
                        AND inasistencia.idanio_lectivo = ?
                        AND ina_fecha BETWEEN '${fecha_desde}' AND '${fecha_hasta}'
                        AND ina_estado =1
                        
        `, [id, idanio_lectivo, idanio_lectivo]);
    }
    static findInasistenciaByIdForCalculate(id, idanio_lecivo) {
        return db.query(`SELECT 
                        idinasistencia,
                        alumno_idalumno,                    
                        materias_idmaterias
                        FROM inasistencia                         
                        WHERE alumno_idalumno = ?
                        AND idanio_lectivo = ?
                        AND ina_estado = 1
                        AND justificada = 0
        `, [id, idanio_lecivo]);
    }
}

module.exports = Inasistencia;