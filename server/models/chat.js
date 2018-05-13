const mongoose = require('mongoose');

let ChatSchema =  new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    users: {
        type: [String],
        required: true,
        minlength: 1,
        trim: true
    },
    messages: {
        type: [String],
        required: false,
    },
    idTypeNotification: {
        type: String,
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
module.exports = { Chat };
