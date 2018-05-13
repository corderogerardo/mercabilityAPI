const express = require('express');
let users = express.Router();
const _ = require('lodash');

// Client ID Google+ Oauth nof-test :
// Client secret :

// My modules exported
let { mongoose } = require('./../db/mongoose');
let { Todo } = require('./../models/todo');
let { User } = require('./../models/user');
let { authenticate } = require('./../middleware/authenticate');
// POST /users
users.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

users.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

users.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

users.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

module.exports = { users };
