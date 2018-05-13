const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    subcategoria: {
        type: [Object],
        required: false,
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    estatus: {
        type: Boolean,
        default: false
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

CategorySchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = { Category };
