const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = Schema({
    titulo:  {
        type: String,
        required: true,
        unique: true
    },
    mensaje: {
        type: String,
        required: true,
    },
    idChat:{
        type: String,
        required: true,
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    _idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

MessageSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

let ChatSchema =  new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    users: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        required: true,
    },
    messages: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Mensaje' }],
        required: false,
    },
    estatus: {
        type: Boolean,
        required: false,
    },
    idType:{
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
ChatSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Chat = mongoose.model('Chat', ChatSchema);
const Mensaje = mongoose.model('Mensaje', MessageSchema);
module.exports = { Mensaje };
