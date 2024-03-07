import { Router } from 'express';
const router = Router();
import ProductoModel from '../../models/product.models.js';
import NewcarritoModel from '../../models/nuevoCarrito.model.js';
import { authMiddleware } from '../../utils.js'


router.get('/', (req, res) => {

});

router.get('/inicio', authMiddleware('jwt'), async (req, res) => {

  //? Si el req.user existe
  try {

    const users = await ProductoModel.find({});

    const uuidSearch = req.user.UUID
    

    const busquedaEnCarrito = await NewcarritoModel.find({ UUID: uuidSearch })


    let suma = 0

    if (busquedaEnCarrito.length > 0) {
      const pruebaArray = busquedaEnCarrito[0].carrito.map(i => i.quantity)



       suma = pruebaArray.reduce((acumulador, valorActual) => acumulador + valorActual)



    }




    res.render('menuPrincipal', { listProducts: users.map(user => user.toJSON()), suma, title: 'Despesa Onelú' })
  } catch (error) {
    next(error);
  }


});

router.get('/carrito', authMiddleware('jwt'), async (req, res, next) => {
  try {
    const uuidSearch = req.user.UUID
   

    const busquedaEnCarrito = await NewcarritoModel.find({ UUID: uuidSearch })
    const listaProductos = await ProductoModel.find({})



    if (busquedaEnCarrito.length === 0) {

      res.render('carritoCompras', { title: 'Despesa Onelú' })

    } else {


      const ProductosDelCarrito = busquedaEnCarrito[0].carrito

      let cambios = []


      const alteracionPrecios = listaProductos.map((i) => {

        ProductosDelCarrito.map((e) => {

          if (e.code == i.code) {


            i._doc.stockReal = i.stock
            //? Si la cantidad en el carrito de la base de datos es menos a la cantidad en el stock. El stock real no cambia en la base, es una forma de renderizar la copia del producto y mostrarlo multiplicando el producto por la cantidad que tengo en la base de datos del carrito
            if (e.quantity <= i.stock) {

              i.stock = e.quantity
              i.price = i.price * i.stock


              //! Esto limita que no se pase del stock y del precio maximo
              //? Por lo tanto se evita sumar mas unidades solicitadas sino existen en la coleccion de productos 
            } else if (e.quantity > i.stock) {


              i.price = i.price * i.stock
              i.stock = i.stock

            }


            cambios.push(i)
          }
        })



      })

      // let arr1 = cambios[0]
      // let arr2 =cantReal[0]

      // let sumArrs={...arr1, ...arr2}

      // console.log('sumArrs es: ',sumArrs)


      // console.log('Esta es la lista de productos con los precios segun las cantidades en el carrito: ', cambios)





      const preciosParciales = cambios.map(i => i.price)

      const sumaPrecios = preciosParciales.reduce((acumulador, valorActual) => acumulador + valorActual)

      const stockParciales =cambios.map(i => i.stock)



      const suma = stockParciales.reduce((acumulador, valorActual) => acumulador + valorActual)





      // console.log('los precios de la lista son', preciosParciales)
      // console.log('La sumatoria fue: ', suma)


      res.render('carritoCompras', { listcarrito: cambios.map(user => user.toJSON()),sumaPrecios, suma, title: 'Carrito Onelú' })

    }


  } catch (error) {
    next(error);
  }
});


export default router;

