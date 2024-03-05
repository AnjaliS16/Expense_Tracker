const express = require('express');
const routes = express.Router();
const add = require('../controller/report');
const authenticate=require('../middleware/auth')

routes.post('/getdate',authenticate.authenticate,add.postdate)

routes.get('/getweekly',authenticate.authenticate,add.getweekly)

routes.post('/getMonthly',authenticate.authenticate,add.postmonthly)

routes.post('/getYearly',authenticate.authenticate,add.postyearly)


module.exports = routes;