const mongoose = require('mongoose');

let InteractionsSchema =  new mongoose.Schema({
    idPublicationInteraction: {
        type: String,
        required: true,
    },
    userInteractions: {
        type: [Object],
        required: true,
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
InteractionsSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Interaction = mongoose.model('Interaction', InteractionsSchema);
module.exports = { Interaction };
