let db = require('../databaes');
class Alumno {
    constructor(
        alu_cedula,
        alu_apellidos_nombres,
        alu_fecha_nac,
        alu_lugar_nac,
        alu_direccion,
        alu_representante_nombres,
        alu_representante_telefono,
        idanio_lectivo
    ) {
        this.alu_cedula = alu_cedula;
        this.alu_apellidos_nombres = alu_apellidos_nombres;
        this.alu_fecha_nac = alu_fecha_nac;
        this.alu_lugar_nac = alu_lugar_nac;
        this.alu_direccion = alu_direccion;
        this.alu_representante_nombres = alu_representante_nombres;
        this.alu_representante_telefono = alu_representante_telefono;
        this.idanio_lectivo = idanio_lectivo;
    }
    static store(Alumno) {
        return db.query('INSERT INTO alumno SET ?', [Alumno]);
    }
    static getAll(idanio_lectivo) {
        return db.query(`SELECT 
                            idalumno,
                            idcurso,
                            alu_cedula,
                            alu_apellidos_nombres,
                            alu_estado, 
                            cur_curso                            
                        FROM alumno
                         INNER JOIN matricula on alumno.idalumno = matricula.alumno_idalumno                 
                         INNER JOIN curso on curso.idcurso = matricula.curso_idcurso
                         WHERE matricula.matr_estado = 1                 
                         AND matricula.mat_idanio_lectivo = ?
        `, [idanio_lectivo]);
    }
    static getAllSinMatricula() {
        return db.query(`SELECT 
                            idalumno,                            
                            alu_cedula,
                            alu_apellidos_nombres,
                            alu_estado,
                            idmatricula                                                       
                        FROM alumno
                         LEFT JOIN matricula on alumno.idalumno = matricula.alumno_idalumno
                         WHERE idmatricula IS NULL
        `);
    }
    static findById(id, idanio_lectivo) {
        return db.query(`SELECT 
        idalumno,
        idcurso,
        alu_apellidos_nombres,
        alu_direccion,
        alu_representante_nombres,
        niv_nivel,
        cur_curso,
        alu_representante_telefono,
        mat_idanio_lectivo
        FROM alumno 
        INNER JOIN matricula on matricula.alumno_idalumno = alumno.idalumno
        INNER JOIN curso on matricula.curso_idcurso = curso.idcurso
        INNER JOIN nivel on nivel.idnivel = curso.nivel_idnivel
        WHERE idalumno = ?
        AND matricula.mat_idanio_lectivo = ?
        AND matr_estado = 1`, [id, idanio_lectivo]);
    }
    static findByCedulaOrNombre(seachText, idanio_lectivo) {
        return db.query(`SELECT 
                            idalumno,
                            idcurso,
                            alu_cedula,
                            alu_apellidos_nombres,
                            alu_estado, 
                            cur_curso                            
                        FROM alumno
                         INNER JOIN matricula on alumno.idalumno = matricula.alumno_idalumno                 
                         INNER JOIN curso on curso.idcurso = matricula.curso_idcurso
                         WHERE matricula.matr_estado = 1                 
                         AND alu_cedula like '%${seachText}%'                                                                
                         OR alu_apellidos_nombres like '%${seachText}%'
                         AND matricula.mat_idanio_lectivo = ?                          
        `, [idanio_lectivo]);
    }
    //OR alu_apellidos_nombres like '%${seachText}%'
    static findByCurso(idcurso, idanio_lectivo) {
        //seleccionar los alumnos correspondientes al idcurso
        return db.query(`SELECT 
        idalumno,
        alu_apellidos_nombres,
        alu_cedula,
        alu_estado,
        idcurso,
        cur_curso,
        alu_representante_nombres,
        cur_ant,
        idmatricula      
        FROM matricula
        INNER JOIN alumno on alumno.idalumno = matricula.alumno_idalumno        
        INNER JOIN curso on curso.idcurso = matricula.curso_idcurso        
        WHERE curso_idcurso = ?              
        AND matricula.mat_idanio_lectivo = ?
        AND matr_estado = 1
        `, [idcurso, idanio_lectivo]);
        //AND alu_estado = 1 
    }
    static getMatricula(idalumno, idanio_lectivo) {
        //obtener idmatricula
        return db.query(`
        SELECT 
            idmatricula,
            curso_idcurso
        FROM 
            matricula
        WHERE 
            alumno_idalumno = ? 
        AND 
            mat_idanio_lectivo = ?
        `, [idalumno, idanio_lectivo]);
    }
    static findByCedula(cedula) {
        return db.query('SELECT idalumno, alu_cedula, alu_apellidos_nombres FROM alumno WHERE alu_cedula = ?', [cedula]);
    }
    static update(Alumno, idalumno) {
        return db.query('UPDATE alumno SET ? WHERE idalumno = ?', [Alumno, idalumno]);
    }
}




module.exports = Alumno;