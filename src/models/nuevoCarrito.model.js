import mongoose, { Schema } from 'mongoose';


const NuevoCarritoSchema = new Schema({

    UUID: { type: String, required: false },

    carrito: [
        {
            title: { type: String, required: false },
            quantity: { type: Number, required: false },
            code: { type: String, required: false }
        }
    ],
    datosCliente: [
        {
            nombre: { type: String, required: false },
            apellido: { type: String, required: false },
            documento: { type: Number, required: false },
            direccion: { type: String, required: false },
            numeracion: { type: Number, required: false },
            telefono: { type: Number, required: false },
            envio: { type: String, required: false },
        }
    ],
    montoTotal: [
        {
            subTotal: { type: Number, required: false },
            envio: { type: Number, required: false },
            total: { type: Number, required: false },

        }
    ]


})

export default mongoose.model('Newcarrito', NuevoCarritoSchema);