import { Router } from 'express';
import ProductoModel from '../../models/product.models.js';
import CarritoModel from '../../models/carrito.model.js';
import { v4 as uuidv4 } from 'uuid'
import { authMiddleware, authRolesMiddleware } from '../../utils.js'

const router = Router();



router.post('/carritoFind', async (req, res, next) => {
    try {
        const { allProducts } = req.body;
      

        let carritoCompras = {}

        allProducts.forEach(e => {
            carritoCompras = e
        });
        console.log('El carrito de compras es', carritoCompras)

        const newCarrito = {
            ...carritoCompras,
            userId: uuidv4(),
        }
        
        console.log('NewCarrito es:  ',newCarrito)

        let criterioDeBusqueda ={
            title:newCarrito.title
        }
        
        //? "Si encuentra en carrito de la DB un producto con el mismo titulo.. guardarlo en un array"
        const productosEncontrados = await CarritoModel.find(criterioDeBusqueda)


       
        
        //?Si la longitud de ese array es igual a cero.. crear nuevo producto en la DB
        if(productosEncontrados.length === 0){
            const user = await CarritoModel.create(newCarrito);
        }
        //? Sino actualizar el producto existente por el nuevo
        else{

            newCarrito.price=(productosEncontrados[0].price+newCarrito.price)
            newCarrito.quantity=(productosEncontrados[0].quantity+newCarrito.quantity)

            const update = await CarritoModel.updateOne(criterioDeBusqueda, newCarrito)
        }

        

    } catch (error) {
        next(error);
    }
});



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