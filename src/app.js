import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { __dirname } from './utils.js';
import passport from 'passport';
import cookieParse from 'cookie-parser';

import { init as initPassport } from './config/passport.config.js'
import indexRouter from './routers/views/index.js';
import productRouter from './routers/views/product.router.js'


const app = express();

app.use(cookieParse())

//Permite a la aplicación Express comprender y trabajar con datos JSON en las solicitudes.
app.use(express.json());


// Permite a la aplicación Express entender y procesar datos enviados en formularios HTML.
// El parámetro 'extended: true' permite el análisis de datos codificados en URL con objetos y matrices complejas.
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos (como CSS, imágenes, etc.) desde el directorio 'public'.
// Esto es útil para exponer archivos estáticos al navegador sin necesidad de rutas específicas en tu código.
app.use(express.static(path.join(__dirname, '../public')));

initPassport();
app.use(passport.initialize());

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexRouter);
 app.use('/api', productRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});

export default app;
