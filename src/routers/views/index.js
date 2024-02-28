import { Router } from 'express';
const router = Router();
import ProductoModel from '../../models/product.models.js';
import CarritoModel from '../../models/carrito.model.js';
import NewcarritoModel from '../../models/nuevoCarrito.model.js';
import { generateToken } from '../../utils.js';
import { v4 as uuidv4 } from 'uuid'
// import { authMiddleware, authRolesMiddleware } from '../../utils.js'

router.get('/', (req, res) => {
    
});

router.get('/inicio', async (req, res) => {




  try {
    
    const UUID = uuidv4()
    const token = generateToken(UUID);
      
    res.cookie('token', token, {
      //? 1000 * 30 = 5min
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
    })
   

    const users = await ProductoModel.find({});

    res.render('menuPrincipal', { listProducts: users.map(user => user.toJSON()), title: 'Despesa Onelú' })
  } catch (error) {
    next(error);
  }


});

router.get('/carrito', async (req, res, next) => {
  try {

    console.log("hola")
    const productos = await CarritoModel.find({});
    console.log('productos del carrito servidor', productos)

    res.render('carritoCompras')
  } catch (error) {
    next(error);
  }
});


export default router;

