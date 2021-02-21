const express=require("express");
const router=express.Router()

const insert = require("../crud/insert.js"); 
const update = require("../crud/update.js");
const remove = require("../crud/remove");
const get = require("../crud/get");

router.post("/insert",async(req,res)=>{
    try{
        var data = req.body;
        var email = req.body.email;
        var tp = {"email":email}
        console.log(req.body)
        var id = await insert({collection:"User",tp})
        return res.status(200).send(id);
    }catch(err){
        console.log(err);
        res.status(500).send(err)}
})

router.get("/get/id/:id",async(req,res)=>{
    try{
        var id = req.params.id;
        var doc = await get({collection:"User",by:"id",id:id});        
        return res.status(200).send(doc);
    }catch(err){
        console.log(err);
        res.status(500).send(err)}       
})

router.get("/get/email/:email",async(req,res)=>{
    try{
        var email = req.params.email;
        var doc = await get({collection:"User",by:"where",where:[{parameter:"email",comparison:"==",value:email}]});        
        return res.status(200).send(doc);
    }catch(err){
        console.log(err);
        res.status(500).send(err)}      
})



module.exports=router