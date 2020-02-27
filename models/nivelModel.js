let db = require('../databaes');
class Nivel {
    constructor(
        niv_extension,
        niv_jornada,
        niv_nivel,
        niv_estado
    ) {
        this.niv_extension = niv_extension;
        this.niv_jornada = niv_jornada;
        this.niv_nivel = niv_nivel;
        this.niv_estado = niv_estado;
    }

    static getAll() {
        return db.query('SELECT * FROM nivel where niv_estado = 1 ORDER BY idnivel ASC ');
    };
}
module.exports = Nivel;