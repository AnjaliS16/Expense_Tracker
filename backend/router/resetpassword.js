const express = require('express');

const resetpasswordController = require('../controller/resetpassword');


const router = express.Router();

//router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

//router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.post('/password/forgotpassword', resetpasswordController.forgotpassword)

router.post('/resetpassword/:resetId', resetpasswordController.resetpassword)

router.get('/check-password-link/:resetId', resetpasswordController.updatepassword)

module.exports = router;