const express = require('express');
let categories = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

// Client ID Google+ Oauth nof-test :
// Client secret :

// My modules exported
let { mongoose } = require('./../db/mongoose');
let { Category } = require('./../models/categories');
let { User } = require('./../models/user');
let { authenticate } = require('./../middleware/authenticate');
categories.post('/categories', authenticate ,(req, res) => {
    let categ = new Category({
        text: req.body.text,
        _creator: req.user._id
    });

    categ.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })

});

categories.get('/categories', authenticate,(req, res) => {
    Category.find({
        _creator: req.user._id
    }).then((categs) => {
        res.send({ categs });
    }, (e) => {
        res.status(400).send(e);
    })
});

categories.get('/categories/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Category.findOne({
        _id:id,
        _creator:req.user._id
    }).then((categ) => {
        if (!categ) {
            return res.status(404).send();
        }

        res.send({ categ });
    }).catch((e) => {
        res.status(400).send();
    })
});

categories.delete('/categories/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Category.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((categ) => {
        if (!categ) {
            return res.status(404).send();
        }
        res.send({ categ });
    }).catch((e) => {
        res.status(400).send();
    })

});

categories.patch('/categories/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Category.findOneAndUpdate({_id:id, _creator:req.user._id}, { $set: body }, { new: true }).then((categ) => {
        if (!categ) {
            return res.status(404).send();
        }
        res.send({ categ });
    }).catch((e) => {
        res.status(400).send();
    });

});

module.exports = { todos };
