let db = require('../databaes');
class anio_lectivo {
    constructor(anio_lectivo) {
        this.anio_lectivo = anio_lectivo;
    }

    static save(anio_lectivo) {
        return db.query(`INSERT INTO anio_lectivo set ? `, [anio_lectivo]);
    }

    static getAll() {
        return db.query(`SELECT * FROM anio_lectivo ORDER BY idanio_lectivo desc`);
    }
    static getAll2() {
        return db.query(`SELECT * FROM anio_lectivo WHERE NOT anio_state = 0 ORDER BY idanio_lectivo desc`);
    }
}
module.exports = anio_lectivo;