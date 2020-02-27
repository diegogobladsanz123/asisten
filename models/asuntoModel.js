let db = require('../databaes');
class Not_asunto {
    constructor(not_asunto, notificaciones_idnotificaciones) {
        this.not_asunto = not_asunto;
        this.notificaciones_idnotificaciones = notificaciones_idnotificaciones;
    }
    static save(Not_asunto) {
        return db.query('INSERT INTO not_asunto SET ?', [Not_asunto]);
    }
}
module.exports = Not_asunto;






