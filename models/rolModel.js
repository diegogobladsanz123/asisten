const db = require('../databaes');
var rol_nombre;
class rol {
    constructor(
        nombre,
        descripcion,
        crear,
        editar,
        eliminar,
        imprimir,
        //estado
        addInasistencia,
        justificarInasistencia,
        delInasistencia,
        addNovedad,
        delNovedad,
        addNotif,
        delNotif
    ) {
        this.rol_nombre = nombre;
        this.rol_descripcion = descripcion;
        this.rol_crear = crear;
        this.rol_editar = editar;
        this.rol_eliminar = eliminar;
        this.rol_imprimir = imprimir;
        //this.rol_state = estado;
        this.addInasistencia = addInasistencia;
        this.justificarInasistencia = justificarInasistencia;
        this.delInasistencia = delInasistencia;
        //
        this.addNovedad = addNovedad;
        this.delNovedad = delNovedad;
        //
        this.addNotif = addNotif;
        this.delNotif = delNotif;
    }
    //TODO::metodos de la clase
    
    static getAll() {
        let admin = 'Administrador';
        //db= db.query(`SELECT * FROM user WHERE fullname LIKE N'%${data.fullname}%' ORDER BY create_time DESC LIMIT ?, ? `, [data.start, data.limit], callback);
        //return db.query(`SELECT * FROM rol WHERE rol_state = 1 AND rol_nombre not like '${admin}'`);
        return db.query(`SELECT * FROM rol WHERE rol_state = 1`);
    }
    static findOrFail(id) {
        return db.query('SELECT * FROM rol WHERE idrol = ? ', [id]);
    }
    static update(rol, id) {
        
        return db.query('UPDATE rol set ? WHERE idrol = ? ', [rol, id]);
    }
    static save(rol) {
        return db.query('INSERT INTO rol set ?', [rol]);
    }
    static findByName(name) {
        //db.query('SELECT rol_nombre from rol where rol_nombre like "%'+req.query.key+'%"',
        //ajax
        return db.query('SELECT * from rol where rol_nombre = ? ', [name]);
    }

    //SETTERS

    set Rol_nombre(val) {
        this.rol_nombre = val;
    }
    set Rol_descripcion(val) {
        this.rol_descripcion = val;
    }
    set Rol_crear(val) {
        this.rol_crear = val;
    }
    set Rol_editar(val) {
        this.rol_editar = val;
    }
    set Rol_eliminar(val) {
        this.rol_eliminar = val;
    }
    set Rol_imprimir(val) {
        this.rol_imprimir = val;
    }
    set Rol_state(val) {
        this.rol_state = val;
    }



}

module.exports = rol;