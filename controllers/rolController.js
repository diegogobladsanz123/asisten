let Rol = require('../models/rolModel');



module.exports = {
    index: async (req, res) => {
        try {
            let row = await Rol.getAll();
            res.render('configuracion/rol/index', {
                'title': 'Roles de usuario',
                row: row
            })
        } catch (e) {
            console.log(`-> Error in rollController@index message: ${e.message}`);
        }
    },
    edit: async (req, res) => {
        try {
            let row = await Rol.findOrFail(req.params.id);

            if (row.length > 0) {
                res.render('configuracion/rol/edit', {
                    title: 'Editar rol',
                    row: row[0]
                })
            }
        } catch (e) {
            console.log(`-> Error in rollController@edit message: ${e.message}`);
            return e;
        }
    },
    update: async (req, res) => {
        

        let rol = new Rol(
            req.body.rol_nombre,
            req.body.rol_descripcion,
            req.body.rol_crear == 'on' ? 1 : 0,
            req.body.rol_editar == 'on' ? 1 : 0,
            req.body.rol_eliminar == 'on' ? 1 : 0,
            req.body.rol_imprimir == 'on' ? 1 : 0,
            
            req.body.addInasistencia == 'on' ? 1 : 0,
            req.body.justificarInasistencia == 'on' ? 1 : 0,
            req.body.delInasistencia == 'on' ? 1 : 0,
            
            req.body.addNovedad == 'on' ? 1 : 0,
            req.body.delNovedad == 'on' ? 1 : 0,
            
            req.body.addNotif == 'on' ? 1 : 0,
            req.body.delNotif == 'on' ? 1 : 0,

        );
        //res.send(req.body.rol_imprimir);
        try {
            await Rol.update(rol, req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Registro actualizado'));
        } catch (e) {
            console.log('Error al actualizar ' + e.message);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al actualizar el registro, codigo: ' + e.message));

        }

    },
    store: async (req, res) => {
        try {
            rol = new Rol(
                req.body.rol_nombre,
                req.body.rol_descripcion,
                req.body.rol_crear == 'on' ? 1 : 0,
                req.body.rol_editar == 'on' ? 1 : 0,
                req.body.rol_eliminar == 'on' ? 1 : 0,
                req.body.rol_imprimir == 'on' ? 1 : 0
            );
            await Rol.save(rol);
            res.redirect('/rol', req.flash('type', 'success'), req.flash('message', `${req.body.rol_nombre} fue registrado.`));
        } catch (e) {
            console.log('Error al registrar ' + e.message);
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al insertar el registro, codigo: ' + e.message));
        }
    },
    findByName: async (req, res) => {

        let rows = await Rol.findByName(req.query.key);
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send(rows);
        }
    }

}