const mongoose = require('mongoose');

const Category = mongoose.model('Category', {
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
    fechaCreacion: {
        type: Boolean,
        default: false
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

});

module.exports = { Category };
