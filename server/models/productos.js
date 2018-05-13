const mongoose = require('mongoose');

let ProductSchema =  new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    idCategory: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: false,
        minlength: 1,
        trim: true
    },
    estatus: {
        type: Boolean,
        required: false,
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
ProductSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = { Product };
