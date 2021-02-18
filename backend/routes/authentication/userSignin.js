const express=require("express");
const router=express.Router()

const insert = require("../../crud/insert.js"); 
const update = require("../../crud/update.js");
const remove = require("../../crud/remove");
const get = require("../../crud/get");



module.exports=router