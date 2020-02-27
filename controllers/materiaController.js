var Materias = require('../models/materiaModel');
module.exports = {
    index: async (req, res) => {
        rows = await Materias.getAll(1);

        res.render('configuracion/materia/index', {
            title: 'Materias',
            rows: rows
        });
    },
    store: async (req, res) => {
        try {
            let materia = new Materias(
                req.body.mat_nombre,
                1
            );
            await Materias.store(materia);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'La materia fue registrada'));


        } catch (e) {
            if (e.code = 'ER_DUP_ENTRY') {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar, la materia ya fue registrada.'));
            }
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar, mensaje: ' + e.message));;

        }
    },
    update: async (req, res) => {
        try {
            let materia = new Materias(
                req.body.mat_nombre,
                1
            );
            await Materias.update(materia, req.params.id);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El nombre fue actualizado.'));

        } catch (e) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error, mensaje: ' + e.message));;
        }
        //res.send('update id= ' + req.params.id + ' new name = ' + req.body.mat_nombre);
    }
}
