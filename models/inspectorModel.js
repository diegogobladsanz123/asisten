let db = require('../databaes');
class Inspector {
    constructor(tipo, curso_idcurso, user_iduser, anio_lectivo_idanio_lectivo) {
        this.tipo = tipo;
        this.curso_idcurso = curso_idcurso;
        this.user_iduser = user_iduser;
        this.anio_lectivo_idanio_lectivo = anio_lectivo_idanio_lectivo;
    }
    static save(Inspector) {
        return db.query('INSERT INTO inspector SET ?', [Inspector]);
    }
    //obtener todos los inspectores correspondientes al anio lectivo seleccionado
    static getAllIc(idanio_lectivo) {
        if (idanio_lectivo != null) {
            return db.query(`
            SELECT
            user.iduser,
                user.fullname,
                user.user_state,
                user.rol_idrol,
                funcionario.fun_nombres,
                funcionario.fun_cedula,
                funcionario.fun_titulo,
                funcionario.fun_telefono,
                inspector.idinspector,
                inspector.tipo
            FROM
            inspector
            JOIN user ON inspector.user_iduser = user.iduser
            JOIN funcionario ON user.profesor_idprofesor = funcionario.idfuncionario
            WHERE
            inspector.anio_lectivo_idanio_lectivo = ?
            AND inspector.tipo = 2
            AND inspector.estado = 1 `, [idanio_lectivo]);
        } else {
            return db.query(`
            SELECT
            user.iduser,
                user.fullname,
                user.user_state,
                user.rol_idrol,
                funcionario.fun_nombres,
                funcionario.fun_cedula,
                funcionario.fun_titulo,
                funcionario.fun_telefono,
                inspector.idinspector,
                inspector.tipo
            FROM
            inspector
            JOIN user ON inspector.user_iduser = user.iduser
            JOIN funcionario ON user.profesor_idprofesor = funcionario.idfuncionario
            WHERE            
            inspector.estado = 1
            AND inspector.tipo = 2 `);
        }
    }
    static getAllIg(idanio_lectivo) {
        if (idanio_lectivo != null) {
            return db.query(`
            SELECT
            user.iduser,
                user.fullname,
                user.user_state,
                user.rol_idrol,
                funcionario.fun_nombres,
                funcionario.fun_cedula,
                funcionario.fun_titulo,
                funcionario.fun_telefono,
                inspector.idinspector,
                inspector.tipo
            FROM
            inspector
            JOIN user ON inspector.user_iduser = user.iduser
            JOIN funcionario ON user.profesor_idprofesor = funcionario.idfuncionario
            WHERE
                inspector.anio_lectivo_idanio_lectivo = ?
            AND inspector.tipo = 1
            AND inspector.estado = 1`, [idanio_lectivo]);
        } else {
            return db.query(`
            SELECT
            user.iduser,
                user.fullname,
                user.user_state,
                user.rol_idrol,
                funcionario.fun_nombres,
                funcionario.fun_cedula,
                funcionario.fun_titulo,
                funcionario.fun_telefono,
                inspector.idinspector,
                inspector.tipo
            FROM
            inspector
            JOIN user
            ON inspector.user_iduser = user.iduser
            JOIN funcionario
            ON user.profesor_idprofesor = funcionario.idfuncionario
            WHERE            
            inspector.estado = 1
            AND inspector.tipo = 1 `);
        }
    }



    /* static getAllIc(idanio_lectivo) { -->respaldo
        if (idanio_lectivo == null) {
            return db.query(`
            SELECT
            rol.idrol,
                rol.rol_nombre,
                rol_user.idanio_lectivo,
                rol_user.state,
                rol_user.idrol_user,
                user.iduser,
                user.fullname,
                user.user_state as ustate,
                funcionario.fun_nombres,
                funcionario.fun_cedula,
                funcionario.fun_titulo,
                funcionario.fun_telefono,
                funcionario.idfuncionario
            FROM
            rol_user
            JOIN rol ON rol_user.rol_idrol = rol.idrol
            JOIN user ON rol_user.user_iduser = user.iduser
            JOIN funcionario ON user.profesor_idprofesor = funcionario.idfuncionario
            WHERE
            colegio.rol_user.idanio_lectivo = ?
            AND
            rol.idrol = 3
        `);
        }
        return db.query(`
        SELECT
        rol.idrol,
            rol.rol_nombre,
            rol_user.idanio_lectivo,
            rol_user.state,
            rol_user.idrol_user,
            user.iduser,
            user.fullname,
            user.user_state as ustate,
            funcionario.fun_nombres,
            funcionario.fun_cedula,
            funcionario.fun_titulo,
            funcionario.fun_telefono,
            funcionario.idfuncionario
        FROM
        rol_user
        JOIN rol ON rol_user.rol_idrol = rol.idrol
        JOIN user ON rol_user.user_iduser = user.iduser
        JOIN funcionario ON user.profesor_idprofesor = funcionario.idfuncionario
        WHERE
        rol_user.idanio_lectivo = ?
        AND rol.idrol = 3
        `, [idanio_lectivo]);



    } */



    //Desvincular curso de inspector
    static unSetInspector(idinspector) {
        return db.query(`
        UPDATE 
        inspector
        SET
        estado = 0
        WHERE
            idinspector = ?
        `, [idinspector]);
    }
    static getAll() {
        return db.query(`
        SELECT 
            * 
        FROM 
            inspector 
        JOIN anio_lectivo on anio_lectivo.idanio_lectivo = inspector.anio_lectivo_idanio_lectivo
        JOIN curso on curso.idcurso = inspector.curso_idcurso
        WHERE inspector.estado = 1
        `);
    }
}
module.exports = Inspector;