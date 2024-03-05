const express = require('express');
const routes = express.Router();
const add = require('../controller/purchase');
const authentication=require('../middleware/auth')

routes.get("/premiummember",authentication.authenticate,add.purchasepremium);

routes.post("/updatetransactionstatus",authentication.authenticate,add.updatetransaction);



module.exports = routes;
