let db = require('../databaes');

class Mhc {
    constructor(
        materias_idmaterias,
        curso_idcurso,
        profesor_idprofesor,
        mat_has_curso_horas,
        mat_has_curso_estado,
        mat_has_curso_idanio_lectivo
    ) {
        this.materias_idmaterias = materias_idmaterias;
        this.curso_idcurso = curso_idcurso;
        this.profesor_idprofesor = profesor_idprofesor;
        this.mat_has_curso_horas = mat_has_curso_horas;
        this.mat_has_cur_estado = mat_has_curso_estado;
        this.mat_has_curso_idanio_lectivo = mat_has_curso_idanio_lectivo;
    }
    static getMaterias(idanio_lectivo) {
        return db.query(`
        SELECT *
        FROM
        materias_has_curso
        INNER JOIN materias ON materias.idmaterias = materias_has_curso.materias_idmaterias
        WHERE mat_has_cur_estado = 1
        AND materias_has_curso.mat_has_curso_idanio_lectivo = ?
        `, [idanio_lectivo]);
    }
    static getAll(idcurso, idanio_lectivo) {
        return db.query(`SELECT * FROM materias_has_curso 
                        INNER JOIN materias on materias.idmaterias = materias_has_curso.materias_idmaterias
                        INNER JOIN funcionario on funcionario.idfuncionario = materias_has_curso.profesor_idprofesor
                        WHERE curso_idcurso = ?
                        AND materias_has_curso.mat_has_curso_idanio_lectivo = ?
                        AND mat_has_cur_estado = 1`, [idcurso, idanio_lectivo]);
    }
    static check(idcurso, idmateria) {
        return db.query(`SELECT * FROM materias_has_curso WHERE curso_idcurso = ? 
        AND materias_idmaterias = ?
        AND mat_has_cur_estado = 1`, [idcurso, idmateria]);
    }

    static save(Mhc) {
        let insert = db.query('INSERT INTO materias_has_curso set ?', [Mhc]);
        return insert;
    }
    static update(Mhc, id) {
        return db.query('UPDATE materias_has_curso set ? where idmaterias_has_curso = ?', [Mhc, id]);
    }
    static findOrFail(idmaterias_has_curso) {
        return db.query(`SELECT * FROM materias_has_curso WHERE idmaterias_has_curso = ?         
        AND mat_has_cur_estado = 1`, [idmaterias_has_curso]);
    }
    static delete(idmaterias_has_curso) {
        return db.query('UPDATE materias_has_curso SET mat_has_cur_estado = 0 WHERE idmaterias_has_curso = ?', [idmaterias_has_curso]);
    }

}


module.exports = Mhc;