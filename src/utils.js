import path from 'path';
import { fileURLToPath } from 'url';
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import passport from 'passport';
import { v4 as uuidv4 } from 'uuid'



const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);



//? 👉 createHash es una funcion que hashea una constraseña en texto plano
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//? 👉 isValidPassword sirve para comparar una contraseña en texto plano con una versión hasheada de esa contraseña almacenada en la base de datos. Devuelve true o False

export const isValidPassword = (password, xUser) => bcrypt.compareSync(xUser, password);


//! SECRETO JWT
export const JWT_SECRET = 'bEub7U!LK{F£rhmzXk!D8861W;Y@=2HC'

//? Generador de token

export const generateToken = (uuid) => {
  const payload = {
    UUID: uuid
  };
  return JWT.sign(payload, JWT_SECRET, { expiresIn: '30m' });
};


//? MIDDLEWARE DE AUTENTICACION 



export const authMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, payload,) {
    if (error) {
      return next(error);
    }

    if (!payload) {

      const UUID = uuidv4()
      const token = generateToken(UUID);
      const minutosCoekie = 30


      res.cookie('token', token, {
        //? 1000 * 30 = 5min

        maxAge: 1000 * 60 * minutosCoekie,
        httpOnly: true,
      })
      req.user = UUID

    } else if (payload) {
      req.user = payload;
    }


    next()

  })(req, res, next);
};



//?MIDDLEWARE DE ROL

export const authRolesMiddleware = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Desautorizado' });
  }
  const { role: userRole } = req.user;

  if (userRole !== role) {

    return res.status(403).render('noPermission');
  }
  next();
};