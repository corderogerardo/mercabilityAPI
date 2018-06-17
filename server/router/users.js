const express = require('express');
let users = express.Router();
const _ = require('lodash');

// Client ID Google+ Oauth nof-test :
// Client secret :

// My modules exported
let { mongoose } = require('./../db/mongoose');
let { Todo } = require('./../models/todo');
let { User, Rol, Person } = require('./../models/user');
let { authenticate } = require('./../middleware/authenticate');
users.post('/users', (req, res, next) => {
    let body = _.pick(req.body, ['email', 'password']);
    let bodyPerson = _.pick(req.body, ['person']);
    console.log("user ",body);
    console.log("person ",bodyPerson);
    let fechaNacimiento = (bodyPerson.person.fechaNacimiento) ? new Date(bodyPerson.person.fechaNacimiento) : null;
    bodyPerson.person.fechaNacimiento = fechaNacimiento;
    console.log(fechaNacimiento);
    let person = new Person(bodyPerson.person);
    // 1. Find Person
    let foundPerson = [];
    let foundPersonState = false;
    let findPerson = async function(){
       try {
           await Person.find({cedula:bodyPerson.person.cedula}).then((p) => {
               if(p.length > 0 && p[0]._id){
               console.log("p1 " + p[0]._id);
                   foundPerson = [...p];
                   foundPersonState = true;
               }
           }).catch(function (e) {
               console.log("error findPerson " + e);
           })
       }catch (e) {
           console.log("error findPerson " + e);
       }
    };
    // 2. if !Person, save person
    let savePerson = async function(){
        if(!foundPersonState){
          try {
              await person.save().then((p) => {
                console.log("p2 " + p);
                foundPerson = p;
              })
          }catch (e) {
              console.log("error savePerson " + e);
              res.status(400).send(e);
          }
      }
    };
    // 3. Find Rol
    let foundRol = [];
    let foundRolState = false;
    let findRol = async function(){
       try {
           await Rol.find({name:'User'}).then((r) => {
               console.log("r " + r.length);
              if(r.length > 0 && r[0]._id){
                  foundRol = [...r];
                  foundRolState = true;
                  console.log("rolUser1 " + r[0]._id);
              }
           }).catch((e) => {
               console.log("findRol error " + e);
           });
       }catch (e) {
           console.log("findRol error " + e);
           res.status(400).send(e);
       }
    };
    // 4. if !Rol, save rol
    let saveRol = async function(){
        try {
            if(!foundRolState){
                let newRol = new Rol({ name: 'User', descripcion: 'Rol for users' });
                await newRol.save().then((rolx) => {
                    console.log("newRol 3 ");
                    foundRol = rolx;
                }).catch((e) => {
                    console.log("saveRol error1 " + e);
                });
            }else{
                console.log("saveRol else ");
            }
        }catch (e) {
            console.log("saveRol error1 " + e);
            res.status(400).send(e);
        }
    };
    // 5. Find user
    let foundUser = [];
    let foundUserState = false;
    let findUser = async function(){
      try {
          await User.find({email:body.email}).then((userx) => {
              console.log("userx " + userx.length);
              if(userx.length > 0 && userx[0]._id){
                  foundUser = [...userx];
                  foundUserState = true;
              }
          }).catch((e) => {
              console.log("findUser1 ", e);
          });
      }catch (e) {
          console.log("findUser2 ", e);
      }
    };
    // 6. if !User, save user
    let saveUser = async function(){
        if(!foundUserState && !foundPersonState){
            try {
                let user = new User(body);
                console.log("foundPerson " + foundPerson);
                console.log("foundRol " + foundRol);
                const personId = (foundPerson[0]) ? foundPerson[0]._id : foundPerson._id;
                const rolId = (foundRol[0]) ? foundRol[0]._id : foundRol._id;
                user.person = personId;
                user.rol = rolId;
                console.log("personId " + personId);
                console.log("rolId " + rolId);
                console.log("saveUser " + user);
                await user.save().then(() => {
                    return user.generateAuthToken();
                }).then((token) => {
                    res.header('x-auth', token).send(user);
                }).catch((e) => {
                    console.log("saveUser1 ", e);
                })
            }catch (e) {
                console.log("saveUser2 ", e);
            }
        }else{
            if(foundPersonState){
                res.status(409).send("CI already exists.");
            }
            res.status(409).send("User already exists.");
        }
    };

    // Main execution
    (async function f() {
      try {
          await findPerson();
          await savePerson();
          await findRol();
          await saveRol();
          await findUser();
          await saveUser();
      }catch (e) {
          res.status(400).send(e);
      }
    })();

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
        res.status(400).send(e);
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
