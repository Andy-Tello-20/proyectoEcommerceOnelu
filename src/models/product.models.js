import mongoose, { Schema } from 'mongoose';


const productSchema = new Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: false },
  price: { type: Number, required: true },
  status: { type: Boolean, required: false },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true }


})

export default mongoose.model('Producto', productSchema);