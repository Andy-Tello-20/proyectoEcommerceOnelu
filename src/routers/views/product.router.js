import { Router } from 'express';
import ProductoModel from '../../models/product.models.js';
import { v4 as uuidv4 } from 'uuid'
import  { authMiddleware, authRolesMiddleware } from '../../utils.js'

const router = Router();



// router.post('/create', async (req, res, next) => {
//   try {
//     const { body } = req;
//     console.log(body)

//     const newUser= {
//       ...body,
//       userId:uuidv4(),
//     }
//     const user = await UsuarioModel.create(newUser);
//     res.redirect('/create')
//   } catch (error) {
//     next(error);
//   }
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