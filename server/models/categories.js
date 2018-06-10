const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SubCategorySchema = new Schema({
    nombre:  {
        type: String,
        required: false,
        unique: true
    },
    descripcion:  {
        type: String,
        required: false
    }
});

let CategorySchema = new Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    subcategoria: {
        type: Schema.Types.ObjectId, ref: 'SubCategory',
        required: false
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
    self.updatedAt = Date.now();
    next();
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);
const Category = mongoose.model('Category', CategorySchema);
module.exports = { Category, SubCategory };
