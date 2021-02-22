const express=require("express");
const router=express.Router()
const admin = require("firebase-admin");
const bcrypt = require('bcrypt')
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

router.post('',async(req,res) => {
    try{
        await bcrypt.hash(req.body.password,4,(err,hash)=>{
            console.log(hash)
            try {  admin.auth().createUser({
                email: req.body.email,
                emailVerified: true,
                phoneNumber:req.body.phone,
                password:hash,
                displayName:req.body.name,
                disabled: false
            })
            return res.json({message:'User Created'})
            } catch(e){
                // console.log(e)
                return res.json({message:'Error creating user'})
        }
        })
    }catch(err){
        console.log(err);
        return res.status(500).send(err)}

})

module.exports=router