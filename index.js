const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const insert = require("./crud/insert.js"); //check crud functions, fairly simple to understand
const update = require("./crud/update.js");
const remove = require("./crud/remove.js");
const get = require("./crud/get");
admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-admin-secret.json")),
});
admin.app;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
// import route files like
// app.use("/<filename>",require("./<filename>"))

// sample route file:

// const express=require("express");
// const router=express.Router()

// router.get("/",async(req,res)=>{
//     try{

//     }catch(err){
//         console.log(err);
//         res.status(500).send(err)}       //please apply this try catch necessarily to all routes
// })

// module.exports=router

const authRoutes = require('./backend/routes/auth.js');

app.use('/auth', authRoutes);

app.listen(5000, () => {
  console.log("listening");
});


