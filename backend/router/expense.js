const express = require('express');
const routes = express.Router();
const add = require('../controller/expense');
const authenticate=require('../middleware/auth')

routes.post("/expense/add-expense",authenticate.authenticate,add.addmethod);

routes.get("/expense/get-expense",authenticate.authenticate,add.getmethod);

routes.delete("/expense/delete-expense/:id",authenticate.authenticate,add.deletemethod);

routes.get('/download' , authenticate.authenticate , add.downloadExpenses);

routes.get('/get-all-urls' , authenticate.authenticate , add.downloadUrls);

routes.post('/get-expense' , authenticate.authenticate,add.getExpenses )


module.exports = routes;
