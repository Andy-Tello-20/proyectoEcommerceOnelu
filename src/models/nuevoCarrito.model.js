import mongoose, { Schema } from 'mongoose';


const NuevoCarritoSchema = new Schema({

    UUID: { type: String, required: false },

    carrito: [
        {   title:{ type: String, required: false },
            quantity: { type: Number, required: false },
            code: { type: String, required: false }
        }
    ]

})

export default mongoose.model('Newcarrito', NuevoCarritoSchema);