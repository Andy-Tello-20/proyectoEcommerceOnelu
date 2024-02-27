import mongoose, { Schema } from 'mongoose';


const NuevoCarritoSchema = new Schema({

    UUID: { type: String, required: false },

    carrito: [
        {
           
            title: { type: String, required: false },
            description: { type: String, required: false },
            price: { type: Number, required: false },
            quantity: { type: Number, required: false },
            img: { type: String, required: false }
        }
    ]

})

export default mongoose.model('Newcarrito', NuevoCarritoSchema);