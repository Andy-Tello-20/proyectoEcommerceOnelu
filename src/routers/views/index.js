import { Router } from 'express';
const router = Router();
import ProductoModel from '../../models/product.models.js';
import CarritoModel from '../../models/carrito.model.js';
import NewcarritoModel from '../../models/nuevoCarrito.model.js';
import { generateToken } from '../../utils.js';
import { v4 as uuidv4 } from 'uuid'
import { authMiddleware } from '../../utils.js'

router.get('/', (req, res) => {

});

router.get('/inicio', authMiddleware('jwt'), async (req, res) => {

//? Si el req.user existe
  try {

   


    // const UUID = uuidv4()
    // const token = generateToken(UUID);
    // const minutosCoekie= 10


    // res.cookie('token', token, {
    //   //? 1000 * 30 = 5min

    //   maxAge: 1000 * 60 * minutosCoekie,
    //   httpOnly: true,
    // })


    const users = await ProductoModel.find({});

    res.render('menuPrincipal', { listProducts: users.map(user => user.toJSON()), title: 'Despesa Onelú' })
  } catch (error) {
    next(error);
  }


});

router.get('/carrito', authMiddleware('jwt'), async (req, res, next) => {
  try {
    const uuidSearch = req.user.UUID
    console.log("req.user.UUID es: ", uuidSearch)

    const busquedaConexion = await NewcarritoModel.find({ UUID: uuidSearch })
   

    
    if (busquedaConexion.length === 0){
      res.render('carritoCompras',{title: 'Despesa Onelú'})
    }else{
      const ProductosDelCarrito = busquedaConexion[0].carrito

     
      const pruebaArray = ProductosDelCarrito.map(i => i.price)

      const suma = pruebaArray.reduce((acumulador, valorActual) => acumulador + valorActual)

      console.log('los precios de la lista son', pruebaArray)
      console.log('La sumatoria fue: ',suma)


      res.render('carritoCompras', { listcarrito: ProductosDelCarrito.map(user => user.toJSON()),suma, title: 'Despesa Onelú' })
    }

    
  } catch (error) {
    next(error);
  }
});


export default router;

