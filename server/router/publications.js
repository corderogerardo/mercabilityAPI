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
    let body = _.pick(req.body, ['titulo', 'descripcion', 'cantidad','precio']);
    let products = _.pick(req.body.producto, ['nombre', 'descripcion','categoria']);
    let images = _.pick(req.body.image, ['nombre', 'url']);
    console.log(body);
    console.log(products);
    console.log(images);

    // Instances of the data comming from Mobile App
    let product = new Product({
        ...products
    });

    let newImage = new Image({
        ...images
    });

    let publication = new Publication({
        ...body
    });

    // Paso 1: Buscar producto
    let foundProduct = [];
    let foundProductState = false;
    let findProduct = async function () {
        try {
            await Product.find({ nombre: products.nombre }).then((p) => {
                if (p.length > 0 && p[0]._id) {
                    console.log("findProduct " + p[0]._id);
                    foundProduct = [...p];
                    foundProductState = true;
                }
            }).catch(function (e) {
                console.log("error findProduct " + e);
            })
        } catch (e) {
            console.log("error findProduct " + e);
        }
    };

    // Paso 2: if !producto, guardar producto
    let foundCategory = [];
    let foundCategoryState = false;
    let findCategory = async function () {
        try {
            await Category.find({ nombre: products.categoria }).then((cat) => {
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

    let saveProduct = async function () {
        if (!foundProductState && foundCategoryState) {
            try {
                product.idCategory = (foundCategory[0]) ? foundCategory[0]._id : foundCategory._id;
                product._creator = req.user._id;
                await product.save().then((p) => {
                    console.log("saveProduct " + p);
                    foundProduct = p;
                })
            } catch (e) {
                console.log("error saveProduct " + e);
                res.status(400).send(e);
            }
        }else{
            if(!foundCategoryState){
                res.status(404).send("Category doesn't exist.");
            }
        }
    };

    // Paso 3: Buscar imagen
    let foundImage = [];
    let foundImageState = false;
    let findImage = async function () {
        try {
            await Image.find({ url: images.url }).then((p) => {
                if (p.length > 0 && p[0]._id) {
                    console.log("findImage " + p[0]._id);
                    foundImage = [...p];
                    foundImageState = true;
                }
            }).catch(function (e) {
                console.log("error findProduct " + e);
            })
        } catch (e) {
            console.log("error findProduct " + e);
        }
    };


    // Paso 4: if !Imagen, guardar imagen
    let saveImage = async function () {
        if (!foundImageState && images.url) {
            try {
                newImage._creator = req.user._id;
                await newImage.save().then((p) => {
                    console.log("saveImage " + p);
                    foundImage = p;
                })
            } catch (e) {
                console.log("error saveImage " + e);
                res.status(400).send(e);
            }
        }else{
            if(foundImageState){
                console.log("Image already exists.");
                //res.status(404).send("Image already exists.");
            }
            console.log("No image url.");
            //res.status(404).send("No image url.");
        }
    };

    // Paso 5: Buscar publicacion
    let foundPublication = [];
    let foundPublicationState = false;
    let findPublication = async function () {
        try {
            await Publication.find({ titulo: body.titulo }).then((p) => {
                if (p.length > 0 && p[0]._id) {
                    console.log("findImage " + p[0]._id);
                    foundPublication = [...p];
                    foundPublicationState = true;
                }
            }).catch(function (e) {
                console.log("error findPublication " + e);
            })
        } catch (e) {
            console.log("error findPublication " + e);
        }
    };

    // Paso 6: if !publicacion, save publication
    let savePublication = async function () {
        if (!foundPublicationState && foundImage && foundProduct ) {
            try {
                const idProducto = (foundProduct[0]) ? foundProduct[0]._id : foundProduct._id;
                const images = (foundImage[0]) ? foundImage[0]._id : foundImage._id;
                publication.idProducto = idProducto;
                if(images){
                    publication.images = images
                }
                publication._creator = req.user._id;
                await publication.save().then((p) => {
                    console.log("savePublication " + p);
                    foundPublication = p;
                    res.status(200).send({ p });
                })
            } catch (e) {
                console.log("error savePublication " + e);
                res.status(400).send(e);
            }
        }else{
            if(foundImageState){
                res.status(404).send("Publication already exists.");
            }
            res.status(404).send("Publication already exists.");
        }
    };

    // Paso 7: Main process execution

    // Main execution
    (async function f() {
        try {
            await findProduct();
            await findCategory();
            await saveProduct();
            await findImage();
            await saveImage();
            await findPublication();
            await savePublication();
        } catch (e) {
            res.status(400).send(e);
        }
    })();

});

publications.get('/publications', authenticate, (req, res) => {
    Publication.find({
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

    Publication.findOne({
        _id: id,
        _creator: req.user._id
    }).then((pub) => {
        if (!pub) {
            return res.status(404).send();
        }

        res.send({ pub });
    }).catch((e) => {
        res.status(400).send();
    })
});

publications.delete('/publications/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Publication.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((pub) => {
        if (!pub) {
            return res.status(404).send();
        }
        res.send({ pub });
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
            await Publication.find({ _id: id }).then((cat) => {
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
