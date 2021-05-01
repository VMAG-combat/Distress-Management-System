const jwt = require("jsonwebtoken");
require("dotenv").config();
const fast2sms = require("fast-two-sms");
var otpGenerator = require("otp-generator");
const insert = require("../crud/insert.js");
const get = require("../crud/get.js");

//do two step verification while login also
//send encrypted password
//make edit profile route
//log new event option --> increase coins in helper user profile

exports.sendotpForRegister = async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    console.log("printing request body")
    // console.log(req.body);

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
            var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false , alphabets:false});
            var message = "Your otp for Bachao Account Registration is: "+otp;
            console.log("sending otp "+otp);
            const response = await fast2sms.sendMessage({authorization: process.env.FAST2SMS_API_KEY, message: message, numbers: [phone], flash:1})
            // console.log(response);
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
        console.log("error in backend")
        return res.status(400).json({error: error});
    } 

}

// check otp in frontend, if matched call this function
exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  const user = {
    name: name,
    email: email,
    password: password,
    phone: phone,
    address: address,
    bloodGrp: "",
    weight: "",
    height: "",
    identificationMark: "",
    medicalHistory: "",
    longitude: "",
    latitude: "",
    points: "",
    incidents: [],
    helped: [],
  };

  try {
    var id = await insert({ collection: "User", data: user });
    // console.log(process.env.JWT_SIGNIN_KEY);
    const token = jwt.sign({ _id: id }, "swsh23hjddnns", { expiresIn: 300 });
    console.log("successfully registered!");
    res.cookie("token", token, { maxAge: 300 * 1000 });
    res.json({
      token,
      user: user,
      id: id,
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.sendotpForLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("printing request body");
  // console.log(req.body);

  try {
    var user = await get({ collection: "User", by: "where", where: [{ parameter: "email", comparison: "==", value: email }] });

    if (user.length == 0) {
      return res.status(400).json({
        error: "No user found",
      });
    } else {
      // console.log(user)
      if (user[0].password === password) {
        //generate otp and send to phone
        //var otp = "8569430"
        var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        var message = "Your otp for Bachao Account Login is: " + otp;
        console.log("sending otp " + otp);
        const response = await fast2sms.sendMessage({authorization: process.env.FAST2SMS_API_KEY, message: message, numbers: [user[0].phone],flash:1})

        res.json({
          otp: otp,
          email: email,
          password: password,
          message: "",
        });
      } else {
        return res.status(400).json({
          error: "Incorrect password",
        });
      }
    }
  } catch (error) {
    console.log("????");
    return res.status(400).json({ error: error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    var user = await get({ collection: "User", by: "where", where: [{ parameter: "email", comparison: "==", value: email }] });
    // console.log(process.env.JWT_SIGNIN_KEY)
    const token = jwt.sign({ _id: user[0].id }, "swsh23hjddnns", { expiresIn: 300 });
    console.log("successfully logged in!");
    res.cookie("token", token, { maxAge: 300 * 1000 });
    res.json({
      token,
      user: user,
      id: user[0].id,
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};
