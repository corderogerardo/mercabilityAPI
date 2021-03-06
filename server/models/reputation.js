const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ReputationSchema =  new Schema({
    titulo: {
        type: String,
        required: true,
    },
    comoComprador: {
        type: Number,
        required: true,
    },
    comoVendedor: {
        type: Number,
        required: true,
    },
    comments: {
        type: [Object],
        required: false,
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
ReputationSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt(Date.now());
    next();
});

const Reputation = mongoose.model('Reputation', ReputationSchema);
module.exports = { Reputation };
