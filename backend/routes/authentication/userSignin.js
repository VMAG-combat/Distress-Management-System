const express=require("express");
const router=express.Router()
const admin = require('firebase-admin')

const insert = require("../../crud/insert.js"); 
const update = require("../../crud/update.js");
const remove = require("../../crud/remove");
const get = require("../../crud/get");

router.get('',async(req,res) =>{
    try{

    }catch(err){
        console.log(err);
        res.status(500).send(err)}
})

router.post('/',async(req,res)=>{
    try{const user = await admin.auth().getUserByEmail(req.body.email)
      {
        try {const token =await admin.auth().createCustomToken(req.body.email)
          res.json(token)} catch(e){
            console.log(e)
              res.json({message:'Error Generating Token!Please try again'})
            }
      }
    }catch(e){
       res.json({message:'no user record found'})
     }
    
  })

module.exports=router