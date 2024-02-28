import { Router } from 'express';
import NewcarritoModel from '../../models/nuevoCarrito.model.js';
import { v4 as uuidv4 } from 'uuid'
import { authMiddleware, authRolesMiddleware } from '../../utils.js'
import { create } from 'express-handlebars';

const router = Router();


router.post('/tuCarrito', authMiddleware('jwt'), async (req, res, next) => {


    try {

        //?desestructurando el carrito desde el front 
        const { allProducts } = req.body;


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
        console.log("req.user.UUID es: ", uuidSearch)

        const busquedaConexion = await NewcarritoModel.find({ UUID: uuidSearch })

        console.log('busquedaConexion es: ', busquedaConexion[0], 'y tiene elementos = a', busquedaConexion.length)


        if (busquedaConexion.length > 0) {


            //? se actualizara ESE producto del especifico
            const array = busquedaConexion[0].carrito.map((i) => {


                // //?Si hay algun elemento/producto con titulo en la database, igual al titulo del producto que obtengo de la peticion...
                if (i.title === newCarrito.title) {
                    i.price = i.price + newCarrito.price;
                    i.quantity = i.quantity + newCarrito.quantity;
                    console.log('i es:', i);

                    return i
                }else{
                    return i
                }
            }
            )

            busquedaConexion[0].carrito = [...array]

            let otherArray =  busquedaConexion[0].carrito

            console.log('otherArray es: ',otherArray)
            
            let otherArray2= otherArray.some(item => item.title === newCarrito.title)

            console.log('otherArray2 es: ',otherArray2)
            console.log('newCarrito es: ',newCarrito)

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





    } catch (error) {
        next(error)
    }


})





// router.post('/carritoFind', async (req, res, next) => {
//     try {
//         const { allProducts } = req.body;


//         let carritoCompras = {}

//         allProducts.forEach(e => {
//             carritoCompras = e
//         });
//         console.log('El carrito de compras es', carritoCompras)

//         const newCarrito = {
//             ...carritoCompras,
//             userId: uuidv4(),
//         }

//         console.log('NewCarrito es:  ',newCarrito)

//         let criterioDeBusqueda ={
//             title:newCarrito.title
//         }

//         //? "Si encuentra en carrito de la DB un producto con el mismo titulo.. guardarlo en un array"
//         const productosEncontrados = await CarritoModel.find(criterioDeBusqueda)




//         //?Si la longitud de ese array es igual a cero.. crear nuevo producto en la DB
//         if(productosEncontrados.length === 0){
//             const user = await CarritoModel.create(newCarrito);
//         }
//         //? Sino actualizar el producto existente por el nuevo
//         else{

//             newCarrito.price=(productosEncontrados[0].price+newCarrito.price)
//             newCarrito.quantity=(productosEncontrados[0].quantity+newCarrito.quantity)

//             const update = await CarritoModel.updateOne(criterioDeBusqueda, newCarrito)
//         }



//     } catch (error) {
//         next(error);
//     }
// });



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