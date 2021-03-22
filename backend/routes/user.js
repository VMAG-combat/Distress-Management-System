const express = require('express');
const router = express.Router();

const { getprofile, editprofile, updatelocation, addFriends, getFriends } = require('../controllers/user.js');
// import controller

//test in postman using: http://localhost:80/user/getprofile/2QV852n3VjFay1Cx4aed
router.get('/getprofile/:userid', getprofile);
router.put('/editprofile', editprofile);
// to update user location periodically
router.put('/updatelocation', updatelocation);
router.put('/addfriend', addFriends);
router.get('/getfriend/:userid', getFriends);

module.exports = router;