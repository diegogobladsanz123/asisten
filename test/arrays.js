/**
 *   find: recupera el primer elemento del array que concuerde con una condición dada -
     map: aplica ciertas acciones sobre cada uno de los elementos del array -
     filter: nos permite filtrar los elementos de un array mediante una condición -
     every: indica si todos los elementos del array cumplen con una condición concreta -
     some: indica si alguno de los elementos del array cumple con una condición concreta -
     reduce: nos permite hacer cálculos a partir de ciertos valores de los elementos contenidos en el array
 */
const productos = [{
        nombre: 'ordenador PC',
        precio: 699,
        departamento: 'tecnología'
    }, {
        nombre: 'Sartenes',
        precio: 39,
        departamento: 'Hogar'
    },
    {
        nombre: 'Reloj calculadora',
        precio: 75,
        departamento: 'tecnología'
    },
    {
        nombre: 'Maquina palomitas',
        precio: 35,
        departamento: 'Hogar'
    },
    {
        nombre: 'Mueble TV',
        precio: 120,
        departamento: 'Hogar'
    },
    {
        nombre: 'Tuppers',
        precio: 10,
        departamento: 'Hogar'
    }
]
//TODO:- find : recupera el primer elemento del array que concuerde con una condición dada
let element = productos.find((item, index) => {
    return item.nombre === 'Sartenes';
})
//console.log(element)

//TODO: - map: aplica ciertas acciones sobre cada uno de los elementos del array
//1 - ejemplo: sumar el iva al precio de cada producto
let productosIva = productos.map((element, index) => {
    let newPrecio = element.precio * 0.12;
    element.Iva = newPrecio;
    element.totalMasIva = newPrecio + element.precio;
    return element;
})
//console.log(productosIva);

//TODO: - filter: nos permite filtrar los elementos de un array mediante una condición
// si retorna true se almacena dentro de la variable
let productosHogar = productos.filter((item) => {
    return item.departamento === 'Hogar';
})
//console.log(productosHogar);

//TODO: every: indica si todos los elementos del array cumplen con una condición concreta
const check = productos.every((item) => {
    return item.precio <= 700;
})
//console.log(check);

//TODO: - some: indica si alguno de los elementos del array cumple con una condición concreta
let obj = productos.some((item) => {
    return item.precio === 39;
})
//console.log(obj)

//TODO: - reduce: nos permite hacer cálculos a partir de ciertos valores de los elementos contenidos en el array

//Ejemplo 1 = sumar el total del precio en los productos
// total: cva sumando los valores durante todas las ejecuciones
let precioTotal = productos.reduce((total, item) => {
    return total + item.precio;
}, 0) //-> valor inicial para que empiece a sumar a partir de 0
//console.log(precioTotal);

//Ejemplo 2: Contar los elemenos del arreglo row
let rows = [{
        idinasistencia: 9,
        alumno_idalumno: 1,
        materias_idmaterias: 0
    },
    {
        idinasistencia: 10,
        alumno_idalumno: 1,
        materias_idmaterias: 0
    },
    {
        idinasistencia: 12,
        alumno_idalumno: 1,
        materias_idmaterias: 355
    },
    {
        idinasistencia: 13,
        alumno_idalumno: 1,
        materias_idmaterias: 355
    },
    {
        idinasistencia: 14,
        alumno_idalumno: 1,
        materias_idmaterias: 355
    },
    {
        idinasistencia: 15,
        alumno_idalumno: 1,
        materias_idmaterias: 359
    },
    {
        idinasistencia: 16,
        alumno_idalumno: 1,
        materias_idmaterias: 359
    }
];

rows.find((item, index) => {
    if (item.idinasistencia == 12) {
        return rows.splice(index, 1);
    }
})
//console.log(rows)


let item2 = rows.map((item, index) => {
    let newVal = item.otherVal = item.idinasistencia * 100;
    return newVal;
})

//console.log(rows);
//console.log('ITEM => ', item2);


//other example
const array = [0, 1, , , , 5, 6];
let val = array.find((item, index) => {

    if (item == 5) {
        array.splice(index, 1);
    }

    //console.log('Visited index: ', index, ' with value: ', item)
})
//console.log(array);
//console.log('array => ', array, ' val => ', val);



//TODO:MAP
let ob = new Map();
 ob.set('administrador','1','2018')
 ob.set('inspector','2','2019')
console.log(ob.get('inspector'));