import { Router } from 'express';
import NewcarritoModel from '../../models/nuevoCarrito.model.js';
import ProductoModel from '../../models/product.models.js';
import { authMiddleware, authRolesMiddleware } from '../../utils.js'
    ;

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


            const actualizarProducto = async () => {
                console.log('busquedaConexion[0].carrito es:', busquedaConexion[0].carrito)
                await busquedaConexion[0].save()
            }

            actualizarProducto()

        }

        if (busquedaConexion.length === 0) {

            //? Si no existe un UUID en la data Base igual a UUID de req.user...creo uno nuevo

            const CarroNuevo = {
                UUID: uuidSearch,
                carrito: [
                    newCarrito
                ]
            }
            const nuevoIngreso = await NewcarritoModel.create(CarroNuevo)

        }


        res.status(200).redirect('/inicio');
   

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

           await  actualizarProducto()

            

        }

        res.status(200).redirect('/carrito')
        

    } catch (error) {
        next(error)
    }



})



// router.post('/getUserByLastName', async (req, res, next) => {

//   try {

//     const { last_name } = req.body;
//     const users = await UsuarioModel.find({ last_name: last_name });


//     res.render('cards', { listUsers: users.map(user => user.toJSON()), title: 'Lista de usuarios' });

//     console.log(users)

//   } catch (error) {
//     next(error);
//   }
// })

// router.post('/updateUserById', async (req, res, next) => {
//   try {
//     const { id } = req.body

//     const criterioDeBusqueda = {
//       userId: id

//     }
//     const usuariosEncontrados = await UsuarioModel.find(criterioDeBusqueda)

//     console.log(usuariosEncontrados)

//     if (usuariosEncontrados.length === 0) {
//       return res.status(401).json({ message: `No se encontró el usuario o el ID no existe 😨.` })
//     }

//     res.render('updateUser', { findedUser: usuariosEncontrados.map(user => user.toJSON()), title: 'Usuario encontrado' })


//   } catch (error) {
//     next(error);
//   }

// })

// router.post('/Updated', async (req, res, next) => {
//   try {
//     const { id } = req.body
//     const { body } = req

//     const criterioDeBusqueda = {
//       userId: id

//     }

//     const update = await UsuarioModel.updateOne(criterioDeBusqueda, { $set: body })
//     res.redirect('/updateUserIndex')
//   } catch (error) {
//     next(error);
//   }
// })
export default router;