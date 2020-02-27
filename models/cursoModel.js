let db = require('../databaes');

class Curso {
    constructor(
        cur_curso,
        cur_estado,
        nivel_idnivel
    ) {
        this.cur_curso = cur_curso;
        this.cur_estado = cur_estado;
        this.nivel_idnivel = nivel_idnivel;

    }

    static getAll() {
        return db.query('SELECT * FROM curso INNER JOIN nivel on nivel.idnivel = curso.nivel_idnivel');

    }
    static getAll2() {
        return db.query('SELECT * FROM curso INNER JOIN nivel on nivel.idnivel = curso.nivel_idnivel WHERE cur_estado = 1');

    }
    static findOrFail(id) {
        return db.query(`
        SELECT *
        FROM
            curso
        WHERE idcurso = ?`, [id]);
    }
    static findTutor(idcurso, idanio_lectivo) {
        return db.query(`
        SELECT
        curso.idcurso,
            tutor.idtutor,
            tutor.idanio_lectivo,
            funcionario.idfuncionario,
            funcionario.fun_nombres
        FROM
            tutor
            JOIN curso ON tutor.curso_idcurso = curso.idcurso
            JOIN funcionario ON tutor.funcionario_idfuncionario = funcionario.idfuncionario
        WHERE
            curso.idcurso = ?
            AND tutor.idanio_lectivo = ?
        `, [idcurso, idanio_lectivo]);
    }
    static findTutores(idanio_lectivo) {
        return db.query(`
        SELECT
        *
        FROM
            tutor            
            JOIN funcionario ON tutor.funcionario_idfuncionario = funcionario.idfuncionario
        WHERE
            tutor.tut_state = 1
        AND 
            tutor.idanio_lectivo = ?
        `, [idanio_lectivo]);
    }
    static update(Curso, id) {
        return db.query('UPDATE curso SET ? where idcurso = ?', [Curso, id]);
    }
    static destroy(id) {
        return db.query('UPDATE curso SET cur_estado = 0 WHERE idcurso = ?', [id]);
    }
    static store(Curso) {
        return db.query('INSERT INTO curso SET ?', [Curso]);
    }
    static findByIc(ic) {
        //find by inspector de curso
        return db.query(`
        SELECT
            *
        FROM
            curso
        WHERE
            user_iduser = ?
        AND
            cur_estado = 1`, [ic]);
    }
    //get todos los cursos con IC y por anio lectivo
    static getCursoConIC(idanio_lectivo) {
        return db.query(`
        SELECT
        curso.idcurso,
            curso.idcurso,
            curso.cur_curso,
            inspector.anio_lectivo_idanio_lectivo,
            inspector.tipo,
            inspector.idinspector,
            inspector.user_iduser,
            user.iduser,
            inspector.estado
        FROM
        inspector
        JOIN curso ON inspector.curso_idcurso = curso.idcurso
        JOIN user ON inspector.user_iduser = user.iduser
        WHERE
        inspector.anio_lectivo_idanio_lectivo = ?
        AND inspector.estado = 1        
        `, [idanio_lectivo]);
    }
    //get todos los cursos sin IC y por anio lectivo
    static getCursoSinIC(idanio_lectivo) {

    }
    //obtener cursos para el IC
    static getCursosForIc(idic, idanio_lectivo) {
        return db.query(`
        SELECT
            curso.idcurso,
            curso.cur_curso,
            curso.cur_estado,
            nivel.niv_nivel
        FROM
            inspector
        JOIN 
            curso ON inspector.curso_idcurso = curso.idcurso
        JOIN 
            nivel ON nivel.idnivel = curso.nivel_idnivel
        WHERE
            inspector.anio_lectivo_idanio_lectivo = ?
        AND 
            inspector.estado = 1
        AND
            inspector.user_iduser = ? `, [idanio_lectivo, idic]);
    }
    static cambiarCurso(idmatricula, idcurso, cur_ant) {
        return db.query('UPDATE matricula SET curso_idcurso = ?, cur_ant =? WHERE idmatricula = ?', [idcurso, cur_ant, idmatricula]);
    }
    static asignarAlumnos(idalumno, idcurso, cur_ant, idanio_lectivo) {
        return db.query(`
            INSERT INTO matricula (alumno_idalumno, curso_idcurso, cur_ant, mat_idanio_lectivo) VALUES(?,?,?,?)
        `, [idalumno, idcurso, cur_ant, idanio_lectivo]);
    };
    static verificarExistencia(idalumno, idcurso, idanio_lectivo) {
        return db.query('SELECT idmatricula FROM matricula WHERE matr_estado = 1 AND alumno_idalumno = ? AND curso_idcurso =? AND mat_idanio_lectivo = ?', [idalumno, idcurso, idanio_lectivo]);
    }
}
module.exports = Curso;