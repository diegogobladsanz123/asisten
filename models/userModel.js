let db = require('../databaes');
let {
    bcrypt
} = require('../public/javascripts/helpers');
class User {
    constructor(
        username,
        fullname,
        password,
        profesor_idprofesor,
        rol_idrol,
        user_state,
        idanio_lectivo
    ) {
        this.username = username;
        this.fullname = fullname;
        this.password = password;
        this.profesor_idprofesor = profesor_idprofesor;
        this.rol_idrol = rol_idrol;
        this.user_state = user_state;
        this.idanio_lectivo = idanio_lectivo;
    }
    static getAll() {
        return db.query('SELECT * FROM user INNER JOIN rol on rol.idrol = user.rol_idrol ORDER BY iduser ASC');
    }
    static getAll2(idanio_lectivo) {
        //solo obtener inspectores de curso
        return db.query(`
                        SELECT
                            *

                            FROM
                        USER INNER JOIN rol_user ON rol_user.user_iduser = USER.iduser
                        WHERE
                        rol_user.state = 1
                        AND USER.idanio_lectivo = ?
                        AND USER.rol_idrol = 3
                        ORDER BY
                        user_state DESC`,[idanio_lectivo]);
    }
    static getAll3(idanio_lectivo) {
        //solo obtener inspectores generales
           return db.query(`
                        SELECT
                            *

                            FROM
                        USER INNER JOIN rol_user ON rol_user.user_iduser = USER.iduser
                        WHERE
                        rol_user.state = 1
                        AND USER.idanio_lectivo = ?
                        AND USER.rol_idrol = 42
                        ORDER BY
                        user_state DESC`, [idanio_lectivo]);
    }
    static save(User) {
        return db.query('INSERT INTO user set ? ', [User]);
    }
    static findOrFail(id) {
        return db.query('SELECT * FROM user where iduser = ?', [id]);
    }
    static update(User, id) {
        return db.query('UPDATE user SET ? where iduser = ?', [User, id]);
    }
    static delete(id) {
        return db.query('UPDATE user SET user_state = 0 where iduser = ?', [id]);
    }
}
module.exports = User;