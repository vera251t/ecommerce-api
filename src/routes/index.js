const express = require('express');
const { route } = require('./user.router');
const routerUser = require('./user.router');
const router = express.Router();

// colocar las rutas aquí
router.use("/users", routerUser)

module.exports = router;