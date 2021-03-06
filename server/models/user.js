const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwtTokenSign = process.env.JWT_SECRET || require('./../config/keys').jwtTokenSign;

let Schema = mongoose.Schema;

let PersonSchema = new Schema({
    cedula:  {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
        unique: true
    },
    fechaNacimiento:{
        type: Date,
        required: false
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
});
PersonSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt = Date.now();
    next();
});
let RolSchema = new Schema({
    name:  {
        type: String,
        required: true,
        unique: true
    },
    descripcion:  {
        type: String,
        required: false
    },
    modules: {
        type: [Object],
        required: false,
    },
    estatus: {
        type: Boolean,
        required: false,
    },
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
});

RolSchema.pre('save', function preSave(next){
    let self = this;
    self.updatedAt = Date.now();
    next();
});

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 4
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    createdAt: {type: Date, default: Date.now, required:false},
    updatedAt: {type: Date, default: Date.now, required:false},
    person: {
        type: Schema.Types.ObjectId, ref: 'Person',
        required: true
    },
    reputation: {
        type: Schema.Types.ObjectId, ref: 'Reputation',
        required: false
    },
    rol: {
        type: Schema.Types.ObjectId, ref: 'Rol',
        required: true
    },
}, {
    usePushEach: true
});
UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, jwtTokenSign ).toString();
    //user.tokens.push({ access, token }); use instead
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    let user = this;
    return user.update({
        $pull: {
            tokens: { token: token }
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, jwtTokenSign);
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    let user = this;
    user.updatedAt = Date.now();
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);
const Person = mongoose.model('Person', PersonSchema);
const Rol = mongoose.model('Rol', RolSchema);
module.exports = { User, Rol, Person };
