import mongoose, { Schema } from 'mongoose';


const carritoSchema = new Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String, required: true }


})

export default mongoose.model('Carrito', carritoSchema);