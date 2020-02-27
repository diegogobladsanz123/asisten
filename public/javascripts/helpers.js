var bcrypt = require('bcryptjs');
var timeago = require('timeago.js');
module.exports = {
    timeago: (timestamp) => {
        return timeago.format(timestamp);
    },
    bcrypt: async (password) => {
        let salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
    matchPassword: async (password, savedPassword) => {
        try {
            return await bcrypt.compare(password, savedPassword);
        } catch (e) {
            console.log(`-> ERROR in helpers.js@matchPassword message: ${e.message}`);
        }
    },
    ifeq: (a, b, options) => {
        if (a == b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    mayorOigual: (a, b, options) => {
        if (a >= b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    percent: (horas, porcentaje_faltas) => {
        total = horas * porcentaje_faltas / 100;
        return total;
    },
    readWrite: (crear, editar, eliminar, imprimir, options) => {

        let labelCrear = `<span class="label label-default"><i class="fas fa-plus"></i>&nbsp;Crear</span><br>`;
        let labelEdit = `<span class="label label-default"><i class="fas fa-edit"></i>&nbsp;Editar</span><br>`;
        let labelDelete = `<span class="label label-default"><i class="fas fa-times"></i>&nbsp;Eliminar</span><br>`;
        let labelPrint = `<span class="label label-default"><i class="fas fa-print"></i>&nbsp;Imprimir</span><br>`;
        let labelNA = `<span class="label label-default"><i class="fas fa-minus-circle"></i>&nbsp;Sin permisos</span><br>`;


        if (crear == 1 && editar == 1 && eliminar == 1 && imprimir == 1) {
            return labelCrear + labelEdit + labelDelete + labelPrint;
        } else if (editar == 1 && eliminar == 1) {
            return labelEdit + labelDelete;
        } else if (eliminar == 1 && imprimir == 1) {
            return labelDelete + labelPrint;
        } else if (editar == 1 && imprimir == 1) {
            return labelEdit + labelPrint;
        } else if (editar == 1) {
            return labelEdit;
        } else if (eliminar == 1) {
            return labelDelete;
        } else if (imprimir == 1) {
            return labelPrint;
        } else {
            return labelNA;
        }
    },
    btnAdd: (crear, route) => {
        btnAdd = `<a href="${route}" data-toggle="modal" class="btn btn-success btn-sm"><i class="fas fa-plus"></i> Añadir</a>`;
        if (crear == 1) {
            return btnAdd;
        }
    },
    btnEdit: (editar, route, id) => {
        btnEditar = `<a href="${route}${id}" data-toggle="modal" class="btn btn-info btn-flat btn-xs" title="Editar"><i
            class="fas fa-edit"></i></a>`;
        if (editar == 1) {
            return btnEditar;
        }
    },
    btnDelete: (eliminar, id, estado) => {
        btnEliminar = `<span data-toggle="modal" href="#modal-delete-${id}" class="btn btn-danger btn-xs" title="Eliminar"><i
            class="fas fa-times text-center"></i>&nbsp;</span>`;
        if (eliminar == 1 && estado == 1) {
            return btnEliminar;
        }
    },
    btnDeleteNotificacion: (eliminar, id, estado) => {
        btnEliminar = `<span data-toggle="modal" href="#modal-delete-notificacion-${id}" class="btn btn-danger btn-flat btn-xs" title="Eliminar">&nbsp;<i
            class="fas fa-times"></i>&nbsp;</span>`;
        if (eliminar == 1 && estado == 1) {
            return btnEliminar;
        }
    },
    btnDelete2: (eliminar, id, estado) => {
        btnEliminar = `<span data-toggle="modal" href="#modal-delete-2-${id}" class="btn btn-danger btn-flat btn-xs" title="Eliminar">&nbsp;<i
            class="fas fa-times"></i>&nbsp;</span>`;
        if (eliminar == 1 && estado == 1) {
            return btnEliminar;
        }
    },
    btnPrint: (print, route, id) => {
        btnPrint = `<a href="${route}${id}" class="btn btn-warning btn-flat btn-xs" title="Imprimir">&nbsp;<i
            class="fas fa-print"></i></a>`;
        if (print == 1) {
            return btnPrint;
        }
    },
    btnShow: (mostrar, route, id) => {
        btnShow = `<a href="${route}${id}" class="btn btn-primary btn-flat btn-xs" title="Ver">&nbsp;<i
            class="fas fa-search"></i></a>`;
        if (mostrar == 1) {
            return btnShow;
        }
    },
    calcPercentFaltas: (faltas, total) => {
        return (faltas * 100 / total).toFixed(2);
    },
    btnJustificar: (justificar, data_target, id) => {
        if (justificar == 1) {
            return `<span class="btn btn-xs btn-default" data-toggle="modal"
                                        data-target="#${data_target}${id}" onclick=""><i class="fa fa-check"
                                            title="Justificar falta"></i>
                                    </span>`;
        }
    },
    //TODO:BTNS INASISTENCIAS
    btnAddInasistencia: (addinasistencia, enlace, anio_state) => {

        if (addinasistencia == 1) {
            let disabled = '';
            let mensaje = 'Registrar inasistencia.';
            if (anio_state == 2) {
                disabled = 'disabled';
                enlace = '';
                mensaje = 'El año lectivo esta finalizado.';
            }

            return `<li class="pull-right"><span data-target="${enlace}" data-toggle="modal"
                        class = "btn btn-warning btn-xs ${disabled}" title="${mensaje}"> <span class = "fa fa-plus"> </span>Inasistencia</span></li>`;
        }
    },
    btnJustificarInasisencia: (justificarInasistencia, enlace, id, estado, anio_state) => {
        let disabled = '';
        let mensaje = 'Justificar falta.';
        if (anio_state == 2) {
            disabled = 'disabled';
            enlace = '';
            id = '';
            mensaje = 'El año lectivo esta finalizado.';
        }
        btn = `<span class="btn btn-xs btn-block btn-default ${disabled}" data-toggle="modal"
                                        data-target="${enlace}${id}"
                                        onclick="clearForm(${id})"><i class="fa fa-check"
                                            title="${mensaje}"></i>
                                    </span>`;

        if (justificarInasistencia == 1 && estado != 0) {
            return btn;
        }
    },
    btnDelInasistencia: (delInasistencia, enlace, id, estado, anio_state) => {
        let disabled = '';
        let mensaje = 'Eliminar falta.';
        if (anio_state == 2) {
            disabled = 'disabled';
            enlace = '';
            id = '';
            mensaje = 'El año lectivo esta finalizado.';
        }
        btn = `<span class="btn btn-xs btn-block btn-danger ${disabled}" data-toggle="modal"
                                        data-target="${enlace}${id}"><i class="fa fa-times"
                                            title="${mensaje}"></i>
                                    </span>`;
        if (delInasistencia == 1 && estado != 0) {
            return btn;
        }

    },
    //TODO: BTNS NOVEDADES
    btnAddNovedad: (addNovedad, enlace, anio_state) => {
        let disabled = '';
        let mensaje = 'Registrar novedad.';
        if (anio_state == 2) {
            disabled = 'disabled';
            enlace = '';
            id = '';
            mensaje = 'El año lectivo esta finalizado.';
        }
        if (addNovedad == 1) {
            return `<li class="pull-right"><span data-target="${enlace}" data-toggle="modal"
                        class="btn btn-warning btn-xs ${disabled}" title="${mensaje}"><span class="fa fa-plus"></span>Novedad</span></li>`;
        }
    },
    btnDelNovedad: (delInasistencia, enlace, id, estado, anio_state) => {
        let disabled = '';
        let mensaje = 'Eliminar inasistencia.';
        if (anio_state == 2) {
            disabled = 'disabled';
            enlace = '';
            id = '';
            mensaje = 'El año lectivo esta finalizado.';
        }
        btnEliminar = `<span data-toggle="modal" href="${enlace}${id}" class="btn btn-danger btn-flat btn-xs ${disabled}" title="${mensaje}">&nbsp;<i
            class="fas fa-times"></i>&nbsp;</span>`;
        if (delInasistencia == 1 && estado == 1) {
            return btnEliminar;
        }
    },
    //TODO: BTNS NOTIFICACIONES
    btnAddNotificacion: (addNotificacion, enlace, anio_state) => {
        let disabled = '';
        let mensaje = 'Registrar notificación.';
        if (anio_state == 2) {
            disabled = 'disabled';
            enlace = '';
            id = '';
            mensaje = 'El año lectivo esta finalizado.';
        }
        if (addNotificacion == 1) {
            return `<li class="pull-right"><span data-target="${enlace}" data-toggle="modal"
                        class="btn btn-warning btn-xs ${disabled}" title="${mensaje}"><span class="fa fa-plus"></span>Notificación</span></li>`;
        }
    },
    btnDelNotificacion: (delNotif, enlace, id, estado, anio_state) => {
         let disabled = '';
         let mensaje = 'Eliminar notificación.';
         if (anio_state == 2) {
             disabled = 'disabled';
             enlace = '';
             id = '';
             mensaje = 'El año lectivo esta finalizado.';
         }
        btnEliminar = `<span data-toggle="modal" href="${enlace}${id}" class="btn btn-danger btn-flat btn-xs ${disabled}" title="${mensaje}">&nbsp;<i
            class="fas fa-times"></i>&nbsp;</span>`;
        if (delNotif == 1 && estado == 1) {
            return btnEliminar;
        }
    },
    //TODO: BUTONS
    anioLectivo: (username, map) => {

        return map.get(username);
    },
    test: (username, map) => {
        return map.get(username);
    }
}