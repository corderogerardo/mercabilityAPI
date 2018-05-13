const mongoose = require('mongoose');

let NotificationSchema =  new mongoose.Schema({
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
    idTypeNotification: {
        type: String,
        required: false,
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
NotificationSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = { Notification };
