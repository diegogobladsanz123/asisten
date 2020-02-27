let data = [{
        idnotificaciones: 85,
        not_fecha: '2019-11-03',
        alu_representante_nombres: 'José', // nombre del representante
        alu_apellidos_nombres: 'Marco', //nombre del alumno
        not_curso: 'INICIAL 1 B',
        not_tutor: 'Maria', //tutor de curso
        idnot_asunto: 77,
        not_asunto: 'Justificar faltas'

    },
    {
        idnotificaciones: 85,
        not_fecha: '2019-11-03',
        alu_representante_nombres: 'José', // nombre del representante
        alu_apellidos_nombres: 'Marco', //nombre del alumno
        not_curso: 'INICIAL 1 B',
        not_tutor: 'Maria', //tutor de curso
        idnot_asunto: 78,
        not_asunto: 'Solucionar asuntos disciplinarios'
    },
    {
        idnotificaciones: 85,
        not_fecha: '2019-11-03',
        alu_representante_nombres: 'José', // nombre del representante
        alu_apellidos_nombres: 'Marco', //nombre del alumno
        not_curso: 'INICIAL 1 B',
        not_tutor: 'Maria', //tutor de curso
        idnot_asunto: 79,
        not_asunto: 'Otros'
    }
]

const data2 = {
    idnotificaciones: '85',
    not_fecha: '2019-11-03',
    alu_representante_nombres: 'José',
    alu_apellidos_nombres: 'Marco',
    not_curso: 'INICIAL 1 B',
    asunto: [{
            idasunto: 1,
            not_asunto: 'Justificar faltas'
        },
        {
            idasunto: 2,
            not_asunto: 'Solucionar asuntos disciplinarios',
        },
        {
            idasunto: 3,
            not_asunto: 'Otros',
        }
    ]
}



//
let dt = {};
if (data.length > 0) {
    dt.idnotificaciones = data[0].idnotificaciones;
    dt.not_fecha = data[0].not_fecha;
    dt.alu_representante_nombres = data[0].alu_representante_nombres;
    dt.alu_apellidos_nombres = data[0].alu_apellidos_nombres;
    dt.not_curso = data[0].not_curso;
    dt.not_tutor = data[0].not_tutor;
    dt.asunto = [];

    dt.asunto = data.map((item) => {
        return {
            id: item.idnot_asunto,
            not_asunto: item.not_asunto
        }

    })
    /* if (data.length >= 1) {
        for (let index = 0; index < data.length; index++) {
            dt.asunto[index] = {
                id: data[index].idnot_asunto,
                not_asunto: data[index].not_asunto
            };
        }
    } */

}

//TODO: map funcion
let orders = [

    {
        orderNumber: 1,
        total: 100,
        customer: {
            name: 'Oscar Blancarte'
        }
    }, {
        orderNumber: 2,
        total: 200,
        customer: {
            name: 'Carlos Raygoza'
        }
    },
    {
        orderNumber: 3,
        total: 300,
        customer: {
            name: 'Andres Bedoya'
        }
    }, {
        orderNumber: 4,
        total: 400,
        customer: {
            name: 'Mateo Perez'
        }
    }

]
let newOrders = orders.map(item => {
    return {
        orderNumber: item.orderNumber,
        total: item.total,
        customer: item.customer.name
    }
})

//console.log("newOrders => ", newOrders)
/*
newOrders =>  [ { orderNumber: 1, total: 100, customer: 'Oscar Blancarte' },
  { orderNumber: 2, total: 200, customer: 'Carlos Raygoza' },
  { orderNumber: 3, total: 300, customer: 'Andres Bedoya' },
  { orderNumber: 4, total: 400, customer: 'Mateo Perez' } ]
*/
let newOr = {};

//END: map funcion
//TODO:: find funcion
const inventario = [{
        nombre: 'manzanas',
        cantidad: 2
    },
    {
        nombre: 'bananas',
        cantidad: 0
    },
    {
        nombre: 'cerezas',
        cantidad: 5
    }
];


function esCereza(fruta) {
    return fruta.nombre === 'manzanas';
}

console.log(inventario.find(esCereza));