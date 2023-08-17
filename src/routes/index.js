const express = require('express');
const { route } = require('./user.router');
const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const router = express.Router();

// colocar las rutas aquí
router.use("/users", routerUser)
router.use("/categories", routerCategory)
router.use("/products", routerProduct)

module.exports = router;