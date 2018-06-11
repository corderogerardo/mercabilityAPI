const express = require('express');
let publications = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

// Client ID Google+ Oauth nof-test :
// Client secret :

// My modules exported
let { mongoose } = require('./../db/mongoose');
let { Category } = require('./../models/categories');
let { Publication, Image } = require('./../models/publicacion');
let { Product } = require('./../models/productos');
let { User } = require('./../models/user');
let { authenticate } = require('./../middleware/authenticate');
publications.post('/publications', authenticate, (req, res) => {
    let body = _.pick(req.body, ['nombre', 'descripcion']);
    let products = _.pick(req.body.products, ['nombre', 'descripcion','categoria']);
    let image = _.pick(req.body.image, ['nombre', 'url']);
    console.log(body);
    console.log(products);
    console.log(image);

    // Paso 1: Buscar producto

    // Paso 2: if !producto, guardar producto

    // Paso 3: Buscar imagen

    // Paso 4: if !Imagen, guardar imagen

    // Paso 5: Buscar publicacion

    // Paso 6: if !publicacion, save publication

    // Paso 7: Main process execution




    let subCateg = new SubCategory({
        ...subcategoria
    });
    let categ = new Category({
        ...body
    });
    //1. Find Subcategory
    let foundSubcategory = [];
    let foundSubcategoryState = false;
    let findSubCaterogy = async function () {
        try {
            await SubCategory.find({ nombre: subcategoria.nombre }).then((p) => {
                if (p.length > 0 && p[0]._id) {
                    console.log("findSubCaterogy " + p[0]._id);
                    foundSubcategory = [...p];
                    foundSubcategoryState = true;
                }
            }).catch(function (e) {
                console.log("error findSubcategory " + e);
            })
        } catch (e) {
            console.log("error findSubcategory " + e);
        }
    };

    //2. if !Subcategory, save subcategory
    let saveSubcategory = async function () {
        if (!foundSubcategoryState) {
            try {
                await subCateg.save().then((p) => {
                    console.log("saveSubcategory " + p);
                    foundSubcategory = p;
                })
            } catch (e) {
                console.log("error saveSubCategory " + e);
                res.status(400).send(e);
            }
        }
    };
    //3. Find Category
    let foundCategory = [];
    let foundCategoryState = false;
    let findCategory = async function () {
        try {
            await Category.find({ nombre: body.nombre }).then((cat) => {
                if (cat.length > 0 && cat[0]._id) {
                    console.log("findCaterogy " + cat[0]._id);
                    foundCategory = [...cat];
                    foundCategoryState = true;
                    console.log("cat " + cat[0]._id);
                }
            }).catch(function (e) {
                console.log("error find category " + e);
            })
        } catch (e) {
            console.log("error find category " + e);
        }
    };

    //4. if !Category, save category
    let saveCategory = async function () {
        if (!foundCategoryState) {
            try {
                const subCategoryId = (foundSubcategory[0]) ? foundSubcategory[0]._id : foundSubcategory._id;
                categ.subcategoria = subCategoryId;
                categ.estatus = true;
                categ._creator = req.user._id;
                await categ.save().then((p) => {
                    console.log("saveCategory " + p);
                    foundCategory = p;
                    //res.send({ p });
                    res.status(200).send({ p });
                }).catch((e) => {
                    console.log("saveCategory ", e);
                })
            } catch (e) {
                console.log("error saveCategory " + e);
                res.status(400).send(e);
            }
        } else {
            res.status(400).send('Category already exists.');
        }
    };

    // Main execution
    (async function f() {
        try {
            await findSubCaterogy();
            await saveSubcategory();
            await findCategory();
            await saveCategory();
        } catch (e) {
            res.status(400).send(e);
        }
    })();

});

publications.get('/publications', authenticate, (req, res) => {
    Category.find({
        _creator: req.user._id
    }).then((categs) => {
        res.send({ categs });
    }, (e) => {
        res.status(400).send(e);
    })
});

publications.get('/publications/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Category.findOne({
        _id: id,
        _creator: req.user._id
    }).then((categ) => {
        if (!categ) {
            return res.status(404).send();
        }

        res.send({ categ });
    }).catch((e) => {
        res.status(400).send();
    })
});

publications.delete('/publications/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Category.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((categ) => {
        if (!categ) {
            return res.status(404).send();
        }
        res.send({ categ });
    }).catch((e) => {
        res.status(400).send();
    })

});

publications.patch('/publications/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion']);
    let subcategoria = _.pick(req.body.subcategoria, ['nombre', 'descripcion']);
    console.log(body);
    console.log(subcategoria);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // 1. find and update subcategory

    let foundCategory = [];
    let foundCategoryState = false;
    let subCategoryID = '';
    let findCategory = async function () {
        try {
            await Category.find({ _id: id }).then((cat) => {
                if (cat.length > 0 && cat[0]._id) {
                    console.log("findCaterogy " + cat[0]._id);
                    foundCategory = [...cat];
                    subCategoryID = cat[0].subcategoria;
                    foundCategoryState = true;
                    console.log("cat " + cat[0]._id);
                }
            }).catch(function (e) {
                console.log("error find category " + e);
            })
        } catch (e) {
            console.log("error find category " + e);
        }
    };

    let updateSubCategory = async function () {
        try {
            await SubCategory.findOneAndUpdate({
                _id: subCategoryID,
            }, { $set: subcategoria }, { new: true }).then((categ) => {
                if (!categ) {
                    return res.status(404).send();
                }
                console.log("subcategory updated " + categ);
            }).catch((e) => {
                console.log("error find updateSubCategory " + e);
            });
        } catch (e) {
            console.log("error find updateSubCategory " + e);
        }
    };

    // 2. find and update category
    let updateCategories = async function () {
        try {
            await Category.findOneAndUpdate({
                _id: id,
                _creator: req.user._id
            }, { $set: body }, { new: true }).then((categ) => {
                if (!categ) {
                    return res.status(404).send();
                }
                res.send({ categ });
            }).catch((e) => {
                console.log("error find updateCategories " + e);
            });
        } catch (e) {
            console.log("error find updateCategories " + e);
        }
    }

    // Main execution
    (async function f() {
        try {
            await findCategory();
            await updateSubCategory();
            await updateCategories();
        } catch (e) {
            res.status(400).send(e);
        }
    })();

});

module.exports = { publications };
