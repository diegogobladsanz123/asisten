let db = require('../databaes');

class rol_user {
    constructor(
        rol_idrol,
        user_iduser,
        idanio_lectivo
    ) {
        this.rol_idrol = rol_idrol;
        this.user_iduser = user_iduser;
        this.idanio_lectivo = idanio_lectivo;
    }
    static getAll() {
        //return db.query('SELECT * FROM user INNER JOIN rol on rol.idrol = user.rol_idrol ORDER BY user_state DESC');
    }
    static save(User) {
        return db.query('INSERT INTO rol_user set ? ', [User]);
    }
}
module.exports = rol_user;