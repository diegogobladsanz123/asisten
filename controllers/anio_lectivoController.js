let Anio_lectivo = require('../models/anio_lectivoModel');
let db = require('../databaes');

module.exports = {
    index: async (req, res) => {
        try {
            let al = await Anio_lectivo.getAll();
            res.render('configuracion/anio_lectivo/index', {
                title: 'Configuración - Anio Lectivo',
                al
            })
        } catch (error) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al obtener la información, ', error.message))
        }


    },
    store: async (req, res) => {
        try {
            let anio_lectivo = new Anio_lectivo(req.body.anio_lectivo);
            await Anio_lectivo.save(anio_lectivo);


            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'Operación exiosa!'));

        } catch (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error: El nombre ya fue registrado.'))
            }
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error al registrar la información, ', error.message))
        }

    },
    activar: async (req, res) => {
        try {
            let idanio_lectivo = req.params.idanio_lectivo;
            db.query(`UPDATE anio_lectivo SET anio_state = 1 WHERE idanio_lectivo = ?`, [idanio_lectivo]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El Año lectivo fue habilitado.'));
        } catch (error) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error', error.message))
        }
    },
    finalizar: async (req, res) => {
        try {
            let idanio_lectivo = req.params.idanio_lectivo;
            db.query(`UPDATE anio_lectivo SET anio_state = 2 WHERE idanio_lectivo = ?`, [idanio_lectivo]);
            res.redirect('back', req.flash('type', 'success'), req.flash('message', 'El Año lectivo fue finalizado.'));
        } catch (error) {
            res.redirect('back', req.flash('type', 'danger'), req.flash('message', 'Error', error.message))
        }
    }
}