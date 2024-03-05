const express = require('express');
const routes = express.Router();
const add = require('../controller/controller');

routes.post("/add-details",add.addmethod);

routes.post("/login",add.login);

routes.get("/get-details",add.getmethod);

module.exports = routes;