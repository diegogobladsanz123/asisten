var db = require('../databaes');
let Curso = require('../models/cursoModel');
class Funcionario {
    constructor(
        fun_nombres,
        fun_cedula,
        fun_titulo,
        fun_telefono,
        fun_state
    ) {
        this.fun_nombres = fun_nombres;
        this.fun_cedula = fun_cedula;
        this.fun_titulo = fun_titulo;
        this.fun_telefono = fun_telefono;
        this.fun_state = fun_state;
    }
    static getAll(state) {
        if (state !== undefined) {
            return db.query('SELECT * FROM funcionario where fun_state = ?', [state]);
        }
        return db.query('SELECT * FROM funcionario');
    }
    static delete(id) {
        return db.query('UPDATE funcionario set fun_state = 0 WHERE idfuncionario = ?', [id]);
    }
    static findById(id) {
        return db.query('SELECT * FROM funcionario where idfuncionario = ?', [id]);
    }
    static update(Funcionario, id) {
        return db.query('UPDATE funcionario set ? WHERE idfuncionario = ?', [Funcionario, id]);
    }
    static save(Funcionario) {
        return db.query('INSERT INTO funcionario set ?', [Funcionario]);
    }
    static findByCi(ci) {
        return db.query('SELECT * FROM funcionario WHERE fun_cedula = ?', [ci]);
    }


    //obtener profesores correspodientes al inspector de curso, 
    //obtenemos los cursos asignados al inspector de curso, posteriormente obtenemos los profesores y materias que se dictan en dicho curso
    static async getProfesoresForIc(idIc, idanio_lectivo) {

        //cursos para inspector de curso
        //let cursos = await db.query('SELECT idcurso FROM curso WHERE user_iduser = ? AND cur_estado = 1', [idIc]);
        let cursos = await Curso.getCursosForIc(idIc, idanio_lectivo);
        //Consulta para obtener las materias, cursos y profesores

        var sql = [];
        if (cursos.length > 0) {
            for (let index = 0; index < cursos.length; index++) {
                let mhc = await db.query(`
                SELECT 
                    idfuncionario,
                    idmaterias_has_curso,
                    profesor_idprofesor,
                    fun_nombres,
                    idmaterias,
                    mat_nombre,
                    cur_curso,
                    idcurso
                FROM materias_has_curso
                    INNER JOIN funcionario on funcionario.idfuncionario = materias_has_curso.profesor_idprofesor
                INNER JOIN materias on materias.idmaterias = materias_has_curso.materias_idmaterias
                INNER JOIN curso on curso.idcurso = materias_has_curso.curso_idcurso
                WHERE materias_has_curso.curso_idcurso = ?
                AND mat_has_cur_estado = 1                
                AND mat_has_curso_idanio_lectivo = ?
                `, [cursos[index].idcurso, idanio_lectivo]);

                if (mhc.length > 0) {
                    mhc.forEach(element => {
                        sql.push(element);
                    });
                }
            }
        }

        return sql
        //return cursos
    }
    static async getProfesoresForIg(idanio_lectivo) {
        //profesores para el inspector general

        //cursos

        let cursos = await db.query('SELECT idcurso FROM curso WHERE cur_estado = 1');
        //Consulta para obtener las materias, cursos y profesores
        var sql = [];
        if (cursos.length > 0) {
            for (let index = 0; index < cursos.length; index++) {
                let mhc = await db.query(`
                SELECT 
                idfuncionario,
                idmaterias_has_curso,
                profesor_idprofesor,
                fun_nombres,
                idmaterias,
                mat_nombre,
                cur_curso,
                idcurso
                FROM 
                    materias_has_curso
                INNER JOIN funcionario 
                    on funcionario.idfuncionario = materias_has_curso.profesor_idprofesor
                INNER JOIN materias 
                    on materias.idmaterias = materias_has_curso.materias_idmaterias
                INNER JOIN curso 
                    on curso.idcurso = materias_has_curso.curso_idcurso
                WHERE curso_idcurso = ?
                    AND mat_has_cur_estado = 1
                    AND materias_has_curso.mat_has_curso_idanio_lectivo = ?
                `, [cursos[index].idcurso, idanio_lectivo]);
                if (mhc.length > 0) {
                    mhc.forEach(element => {
                        sql.push(element);
                    });
                }
            }
        }

        return sql
        //return cursos
    }
    static getAllInasistenciasFaltas(idanio_lectivo) {
        //for IG
        return db.query(`
        SELECT 
            * 
        FROM
            inasistencia_profesor 
        INNER JOIN funcionario on funcionario.idfuncionario = inasistencia_profesor.idprofesor
        WHERE idanio_lectivo = ?
        `, [idanio_lectivo]);
    }
    static getAllInasistenciasFaltasForIc(id, idanio_lectivo) {
        //For IC
        return db.query(`
        SELECT
            inasistencia_profesor.*,
            funcionario.fun_nombres
        FROM
            inasistencia_profesor
        JOIN funcionario
            ON inasistencia_profesor.idprofesor = funcionario.idfuncionario
        WHERE 
            inasistencia_profesor.idanio_lectivo = ?

        `, [idanio_lectivo]);
    }
    static getAllInasistenciasFaltasById(id, idanio_lectivo) {
        return db.query(`
        SELECT * FROM
        inasistencia_profesor 
        INNER JOIN funcionario on funcionario.idfuncionario = inasistencia_profesor.idprofesor
        WHERE idfuncionario = ?
        AND
        inasistencia_profesor.idanio_lectivo = ?`, [id, idanio_lectivo]);
    }
}

module.exports = Funcionario;