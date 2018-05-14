const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ImageSchema = Schema({
    estatus:  {
        type: Boolean,
    },
    name: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

ImageSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});
// Getter
ImageSchema.path('total').get(function(num) {
    return (num / 100).toFixed(2);
});
// Setter
ImageSchema.path('total').set(function(num) {
    return num * 100;
});

let PublicationSchema =  new Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    idProducto:{
        type: Schema.Types.ObjectId, ref: 'Product',
        required: false,
    },
    cantidad:{
        type: Number,
        required: true,
    },
    precio:{
        type: Number,
        required: true
    },
    images:{
        type: [{ type: Schema.Types.ObjectId, ref: 'Image'}],
        required: false,
    },
    idFacturacion:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    estatus: {
        type: Boolean,
        required: false,
    },
    duracion: {type: Date, required:false},
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
// Getter
PublicationSchema.path('precio').get(function(num) {
    return (num / 100).toFixed(2);
});
// Setter
PublicationSchema.path('precio').set(function(num) {
    return num * 100;
});
PublicationSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Image = mongoose.model('Image', ImageSchema);
const Publication = mongoose.model('Publication', PublicationSchema);
module.exports = { Publication };
