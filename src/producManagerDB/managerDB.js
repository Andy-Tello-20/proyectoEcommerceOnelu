import { init as initMongoDB } from '../db/mongodb.js';

await initMongoDB();

import ProductoModel from '../../src/models/product.models.js';
import NewcarritoModel from '../../src/models/nuevoCarrito.model.js';


export const sumadorPreciosCarrito = async (id) => {

    let sumaParcial = []

    const busquedaConexion = await NewcarritoModel.find({ UUID: id });
    const ProductosDB = await ProductoModel.find({})

    let ProductosDelCarrito = busquedaConexion[0].carrito


    ProductosDB.filter((i) => {

        ProductosDelCarrito.filter((e) => {

            if (e.code == i.code) {

                let factor = i.price * e.quantity

                console.log('factor es de tipo', typeof (factor))

                sumaParcial.push(factor)

            }
        })

    })


    console.log('precios parciales:', sumaParcial)


    let subTotalPrecio = sumaParcial.reduce((acumulador, valorActual) => acumulador + valorActual, 0)

    return subTotalPrecio

    console.log(' que es suma en inicio?:', subTotalPrecio)

}






