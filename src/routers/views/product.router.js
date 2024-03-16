import { Router } from 'express';
import NewcarritoModel from '../../models/nuevoCarrito.model.js';
import ProductoModel from '../../models/product.models.js';
import { authMiddleware, checkCartNotEmptyMiddleware } from '../../utils.js'
import { calcularDistancia } from '../../productManager/calculadoraDistancia.js'
import { sumadorPreciosCarrito } from '../../producManagerDB/managerDB.js';
import { calcularCostoEnvio } from '../../productManager/calculadoraPrecioEnvio.js';

const router = Router();


router.post('/tuCarrito', authMiddleware('jwt'), async (req, res, next) => {


    try {

        //?desestructurando el carrito desde el front 
        const { allProducts } = req.body;

        console.log('allproducts: ', allProducts)
        let carritoCompras = {}

        allProducts.forEach(e => {
            carritoCompras = e
        });
        // console.log('El carrito de compras es', carritoCompras)

        const newCarrito = {
            ...carritoCompras,
        }
        console.log('newCarrito es :', newCarrito)

        const copiaNewCarrito = [newCarrito]
        // console.log('copiaNewCarrito es :', copiaNewCarrito)

        const uuidSearch = req.user.UUID
        // console.log("req.user.UUID es: ", uuidSearch)

        const busquedaConexion = await NewcarritoModel.find({ UUID: uuidSearch })
        const ProductosDB = await ProductoModel.find({})

        // console.log('Esto es productoDB: ', ProductosDB)

        // console.log('busquedaConexion es: ', busquedaConexion[0], 'y tiene elementos = a', busquedaConexion.length)
        // //?Que pasaria si desde el HTML se altera la cantidad de productos, ingresando mas de lo disponible en el stock?
        const SinAlteraciones = ProductosDB.filter((item) => {
            return item.code === newCarrito.code && newCarrito.quantity > item.stock;
        });
        console.log('SinAlteraciones verifico que: ', SinAlteraciones)


        if (busquedaConexion.length > 0) {


            //? se actualizara ESE producto del especifico
            const array = busquedaConexion[0].carrito.map((i) => {


                //? Si el elemento que intento agregar proviene de la pagina INICIO realiza lo siguiente..

                const existePropiedad = Object.keys(newCarrito).some(key => key === 'fuenteInicio')

                if (i.code === newCarrito.code && existePropiedad) {

                    if (SinAlteraciones.length > 0) {

                        i.quantity = SinAlteraciones[0].stock
                        console.log('que pasaria si...', i.quantity)
                        console.log('sin anteraciones en i : ', i)



                        return i
                    } else {
                        i.quantity = i.quantity + newCarrito.quantity

                        console.log('I es inicio: ', i)

                        // console.log('aca newCarrito.quantity > i.quantity entonces i.quantity es: ', i.quantity)


                        return i
                    }


                }


                // //?Si hay algun elemento/producto con titulo en la database, igual al titulo del producto que obtengo de la peticion...
                if (i.code === newCarrito.code && !existePropiedad) {


                    if (SinAlteraciones.length > 0) {

                        i.quantity = SinAlteraciones[0].stock
                        console.log('que pasaria si...', i.quantity)
                        console.log('sin anteraciones en i : ', i)



                        return i
                    }


                    if (newCarrito.quantity < i.quantity) {

                        i.quantity = newCarrito.quantity

                        // console.log('aca newCarrito.quantity < i.quantity entonces i.quantity es: ', i.quantity)
                    } else if (newCarrito.quantity > i.quantity) {

                        i.quantity = i.quantity + (newCarrito.quantity - i.quantity)

                        // console.log('aca newCarrito.quantity > i.quantity entonces i.quantity es: ', i.quantity)

                    }


                    console.log('i es:', i);

                    return i
                } else {
                    return i
                }
            }
            )

            busquedaConexion[0].carrito = [...array]

            let otherArray = busquedaConexion[0].carrito

            console.log('otherArray es: ', otherArray)

            //? A partir de esta linea los codigos sirven solo para agregar al carrito productos nuevos que no se encontraban en la base de datos, 

            let otherArray2 = otherArray.some(item => item.code === newCarrito.code)

            console.log('otherArray2 es: ', otherArray2)
            // console.log('newCarrito es: ',newCarrito)

            if (!otherArray2) {
                otherArray.push(newCarrito);
                busquedaConexion[0].carrito = [...otherArray]
            }

            //?Guardando cambios en el carrito de la base de datos 

            const actualizarProducto = async () => {
                console.log('busquedaConexion[0].carrito es:', busquedaConexion[0].carrito)
                await busquedaConexion[0].save()
            }

            await actualizarProducto()

            // //? Añadiendo suma total al producto

            let precioParcial = await sumadorPreciosCarrito(uuidSearch)
            console.log('El precio parcial en el router carrito es:', precioParcial)

            let ingresarCostoEnvio = busquedaConexion[0].montoTotal

            if (busquedaConexion[0].montoTotal.length == 0) {
                ingresarCostoEnvio.push({ subTotal: precioParcial }, { envio: 0 }, { total: 0 })
            } else {
                ingresarCostoEnvio[0].subTotal = precioParcial
            }



            await actualizarProducto()


            res.status(200).send('Operación exitosa');
        }

        if (busquedaConexion.length === 0) {

            let subT = ProductosDB.find(i => i.code == newCarrito.code)

            console.log('subt es:', subT)


            //? Si no existe un UUID en la data Base igual a UUID de req.user...creo uno nuevo

            const CarroNuevo = {
                UUID: uuidSearch,
                carrito: [
                    newCarrito
                ],
                montoTotal: [
                    {
                        subTotal: 0,
                        envio: 0,
                        total: 0
                    }
                ]

            }
            const nuevoIngreso = await NewcarritoModel.create(CarroNuevo)

            let precioParcial = await sumadorPreciosCarrito(uuidSearch)
            console.log('El precio parcial en el router carrito es productoNuevo:', precioParcial)




        }





    } catch (error) {
        next(error)
    }


})



router.post('/deleteProduct', authMiddleware('jwt'), async (req, res, next) => {

    try {

        //?desestructurando el carrito desde el front 
        const { ProdDelete } = req.body;

        console.log('ProdDelete: ', ProdDelete)
        let codigoABorrar = {}

        ProdDelete.forEach(e => {
            codigoABorrar = e
        });


        console.log('el codigo a borrar es: ', codigoABorrar)


        const uuidSearch = req.user.UUID
        // console.log("req.user.UUID es: ", uuidSearch)

        const busquedaConexion = await NewcarritoModel.find({ UUID: uuidSearch })
        //  const ProductosDB = await ProductoModel.find({codigoABorrar})

        console.log('busquedaConexion es: ', busquedaConexion)

        //  .deleteOne({ tuCampo: valor })
        if (busquedaConexion.length > 0) {


            let indice = busquedaConexion[0].carrito.findIndex(item => {
                return item.code == codigoABorrar.code
            })


            busquedaConexion[0].carrito.splice(indice, 1)

            console.log('Ahora el carrito de compras es: ', busquedaConexion[0].carrito)


            const actualizarProducto = async () => {
                console.log('busquedaConexion[0].carrito es:', busquedaConexion[0].carrito)
                await busquedaConexion[0].save()
            }

            await actualizarProducto()



        }

        res.status(200).redirect('/carrito')


    } catch (error) {
        next(error)
    }



})



router.post('/infoCliente', authMiddleware('jwt'), async (req, res, next) => {



    try {

        const uuidSearch = req.user.UUID
        const busquedaConexion = await NewcarritoModel.find({ UUID: uuidSearch })
        console.log('busquedaConexion es: ', busquedaConexion)


        const { body } = req

        console.log(body)




        if (busquedaConexion[0].datosCliente.length == 0) {

            //? se ingresa los datos del cliente al array "datosCliente"

            let ingresarDatos = busquedaConexion[0].datosCliente.push(body)

            console.log('datos clientes es: ', busquedaConexion[0].datosCliente)



            let calle = busquedaConexion[0].datosCliente[0].direccion
            let numero = busquedaConexion[0].datosCliente[0].numeracion
            numero = numero.toString()


            let distancia = await calcularDistancia(calle, numero);
            distancia = parseFloat(distancia.toFixed(2))



            const costoEnvio = calcularCostoEnvio(distancia);
            console.log('El costo de envío es:', costoEnvio);

            let ingresarCostoEnvio = busquedaConexion[0].montoTotal[0].envio = costoEnvio


            console.log('datos el envio son: ', ingresarCostoEnvio)

        }






        const actualizarProducto = async () => {

            await busquedaConexion[0].save()
        }

        await actualizarProducto()



        res.status(200).redirect('/resumenYEnvio')
    } catch (error) {
        next(error)
    }





})

router.post('/resumen', authMiddleware('jwt'), async (req, res, next) => {

    try {

        const uuidSearch = req.user.UUID
        const busquedaConexion = await NewcarritoModel.find({ UUID: uuidSearch })
        console.log('busquedaConexion es desde "/resumen": ', busquedaConexion)
        const { body } = req

        console.log('Destino:', body.metodoEnvio)

        if (busquedaConexion[0].datosCliente.length > 0 && body.metodoEnvio == 'domicilio') {

            console.log(' se cumplio ')
            let calle = busquedaConexion[0].datosCliente[0].direccion
            let numero = busquedaConexion[0].datosCliente[0].numeracion
            numero = numero.toString()


            let distancia = await calcularDistancia(calle, numero);
            distancia = parseFloat(distancia.toFixed(2))



            // console.log('de que tipo es distancia:',typeof (distancia))
            // console.log('La distancia calculada es:', distancia);





        }


        res.redirect('/resumenYEnvio')

    } catch (error) {

    }



})



//     try {
//         const { nombre, direccion, otrosDatos } = req.body; // Datos del formulario del cliente
//         const UUID = obtenerUUID(req); // Función para obtener el UUID del cliente

//         // Recuperar el carrito asociado al cliente
//         const carrito = await NuevoCarrito.findOne({ UUID });

//         if (carrito) {
//             // Asociar los datos del cliente con el carrito
//             carrito.datosCliente = { nombre, direccion, ...otrosDatos };

//             // Guardar el carrito actualizado en la base de datos
//             await carrito.save();

//             // Realizar otras acciones relacionadas con la finalización del pedido si es necesario

//             res.redirect('/pagina-de-confirmacion'); // Redirigir a la página de confirmación
//         } else {
//             // Manejar caso donde no se encuentra el carrito asociado al cliente
//             res.status(404).send('Carrito no encontrado');
//         }
//     } catch (error) {
//         next(error);
//     }
// });

export default router;