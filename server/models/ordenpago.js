const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PagoSchema = Schema({
    estatus:  {
        type: Boolean,
    },
    detalles: {
        type: String,
        required: false,
    },
    total: {
        type: Number,
        required: true,
    },
    idOrdenPago:{
        type: Date,
        required: true
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
});

PagoSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});
// Getter
PagoSchema.path('total').get(function(num) {
    return (num / 100).toFixed(2);
});
// Setter
PagoSchema.path('total').set(function(num) {
    return num * 100;
});


let OrdenPagoSchema =  new Schema({
    idPublicacion: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    idComprador: {
        type: String,
        required: true,
    },
    pago:{
        type: Schema.Types.ObjectId, ref: 'Pago', required: false
    },
    total:{
        type: Number,
        required: false,
    },
    estatus: {
        type: Boolean,
        required: false,
    },
    fechaOrden: {type: Date, required:false},
    fechaEntrega: {type: Date, required:false},
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
// Getter
OrdenPagoSchema.path('total').get(function(num) {
    return (num / 100).toFixed(2);
});
// Setter
OrdenPagoSchema.path('total').set(function(num) {
    return num * 100;
});
OrdenPagoSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Ordenpago = mongoose.model('Ordenpago', OrdenPagoSchema);
const Pago = mongoose.model('Pago', PagoSchema);
module.exports = { Ordenpago };
