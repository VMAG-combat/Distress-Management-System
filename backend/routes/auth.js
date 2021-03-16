const express = require('express');
const router = express.Router();

const { register, login, sendotpForRegister, sendotpForLogin } = require('../controllers/auth.js');
// import controller

//route to be called for fetching otp during registration
router.post('/sendotpForRegister', sendotpForRegister);
//route to be called if otp entered by user for registration is correct
router.post('/register', register);

//route to be called for fetching otp during login
router.post('/sendotpForLogin', sendotpForLogin);
//route to be called if otp entered by user for login is correct
router.post('/login', login);

module.exports = router;