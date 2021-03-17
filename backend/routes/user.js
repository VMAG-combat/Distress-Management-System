const express = require('express');
const router = express.Router();

const { getprofile, editprofile, updatelocation } = require('../controllers/user.js');
// import controller

//test in postman using: http://localhost:80/user/getprofile/2QV852n3VjFay1Cx4aed
router.get('/getprofile/:userid', getprofile);
router.put('/editprofile', editprofile);
// to update user location periodically
router.put('/updatelocation', updatelocation);
module.exports = router;