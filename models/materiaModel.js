let db = require('../databaes');
class Materia {
    constructor(
        mat_nombre,
        mat_state
    ) {
        this.mat_nombre = mat_nombre;
        this.mat_state = mat_state;
    }

    static store(Materia) {
        return db.query('INSERT INTO materias SET ?', [Materia]);
    }
    static update(Materia, id) {
        return db.query('UPDATE materias SET ? WHERE idmaterias =?', [Materia, id])
    }

    static getAll(state) {
        if (typeof (state) !== 'undefined') {
            return db.query('SELECT * FROM materias WHERE mat_state = ? ', [state]);
        } else {
            return db.query('SELECT * FROM materias');
        }
    }

    static findByCurso(idcurso, idanio_lectivo) {
        //obtener materias segun el curso
        return db.query(`
        SELECT 
            * 
        FROM 
            materias 
        INNER JOIN 
            materias_has_curso on materias.idmaterias = materias_has_curso.materias_idmaterias
        INNER JOIN 
            curso on curso.idcurso = materias_has_curso.curso_idcurso
        WHERE 
            mat_has_cur_estado = 1
        AND 
            curso_idcurso = ?
        AND 
            materias_has_curso.mat_has_curso_idanio_lectivo = ?`, [idcurso, idanio_lectivo]);
    }
    static findByIdProfesor(idprofesor, idanio_lectivo) {
        //obtener materias segun el profesor
        return db.query(`
        SELECT 
            * 
        FROM 
            materias_has_curso
        INNER JOIN curso 
            on curso.idcurso = materias_has_curso.curso_idcurso
        INNER JOIN 
            materias 
            on materias.idmaterias = materias_has_curso.materias_idmaterias
        WHERE 
            profesor_idprofesor = ?
        AND 
            mat_has_cur_estado = 1
        AND 
            materias_has_curso.mat_has_curso_idanio_lectivo = ?
        `, [idprofesor, idanio_lectivo]);
    }
}

module.exports = Materia;