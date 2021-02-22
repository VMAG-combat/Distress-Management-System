const express = require('express');
const router = express.Router();

const { register, login, sendotp } = require('../controllers/auth.js');
// import controller

router.post('/login', login);

router.post('/sendotp', sendotp);
router.post('/register', register);

module.exports = router;