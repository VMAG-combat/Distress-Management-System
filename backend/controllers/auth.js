const jwt = require('jsonwebtoken');
require('dotenv').config();
const fast2sms = require('fast-two-sms');
var otpGenerator = require('otp-generator') 
const insert = require('../crud/insert.js');
const get = require('../crud/get.js');

exports.sendotp = async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    console.log("printing request body")
    console.log(req.body);

    try {
        var user = await get({collection:"User",by:"where",where:[{parameter:"email", comparison:"==",value:email}]})

        if(user.length!=0){
            res.json({
                message: "User already exists. Please Login!"
            }); 
        }
        else{
            //generate otp and send to phone
            //var otp = "8569430"
            var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
            var message = "Your otp for Bachao Account Registration is: "+otp;
            console.log("sending otp "+otp);
            const response = await fast2sms.sendMessage({authorization: process.env.FAST2SMS_API_KEY, message: message, numbers: [phone]})
            console.log(response);
            res.json({
                otp: otp,
                name: name,
                email: email,
                password: password,
                phone: phone,
                address: address,
                message:""
            });
        }
    } catch (error) {
        return res.status(400).json({error: error});
    } 

}

// check otp in frontend, if matched call this function 
exports.register = async (req, res) => {

    const { name, email, password, phone, address } = req.body;

    const user = {name: name, email:email, password: password, phone:phone, address:address, bloodGrp:"", weight:"",height:"", identificationMark:"",medicalHistory:""}
    
    try {
       var id = await insert({collection:"User",data:user}) 
    console.log(process.env.JWT_SIGNIN_KEY)
        const token = jwt.sign({_id: id}, "swsh23hjddnns", {expiresIn: 300});
        console.log("successfully registered!");
        res.cookie("token", token, { maxAge: 300*1000 })
        res.json({
            token,
            user:user,
            error:""
        })

    } catch (error) {
        return res.status(400).json({
            error:error
        })
    }


}

exports.login = async (req, res) => {

    const { email, password } = req.body;
    console.log(req.body)
    try {
        var user = await get({collection:"User",by:"where",where:[{parameter:"email", comparison:"==",value:email}]}) 
        if(!user){
            return res.status(400).json({
                error:"No user found" 
            });
        }else{
            console.log(user)
            if(user[0].password === password){
                const token = jwt.sign({_id: user._id}, "swsh23hjddnns", {expiresIn: '7d'});
                res.cookie("token", token, { maxAge: 300*1000 })
                console.log("Successfully logged in!");
                res.json({
                    token,
                    user: user,
                    error: "",
                });
            }else{
                return res.status(400).json({
                    error:"Incorrect password" 
                });
            }
        }
        
    } catch (error) {
        return res.status(400).json({
            error:"failed to login!"
        })
    }

}