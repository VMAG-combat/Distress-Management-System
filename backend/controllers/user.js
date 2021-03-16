const update = require('../crud/update.js');
const get = require('../crud/get.js');

exports.editprofile = async (req, res) => {
    const user = req.body;
//module.exports = async (obj = { collection: "string", data: {}, id: "string" }) => {
    console.log(user);
    try {
        var id = await update({collection: "User", data:user,id:user.id});
        console.log("User Profile Updated Successfully");
        res.json({
            message: "",
            user: user,
        })

    } catch (error) {
        console.log(error);
        console.log("Error in updating")
        res.status(400).json({
            message: "Error in Updating User Profile",
        });
    }
}

exports.getprofile = async (req, res) => {
    const id = req.params.userid;
    console.log(id);
    try {
        var user = await get({collection:"User",by:"id", id:id})
        console.log("user profile fetched succesfully");
        res.json({
            message: "",
            user: user,
        })
    } catch (error) {
        console.log("Error in fetching profile");
        res.status(400).json({
            message:"Error in fetching profile"
        })
    }
}

exports.updatelocation = async (req, res) => {

    // req.body should have {userid, latitude, longitude}
    var newuser = req.body;

    try {
        var user = await get({collection:"User",by:"id", id:newuser.userid})
        user.longitude = newuser.longitude;
        user.latitude = newuser.latitude
        var id = await update({collection: "User", data:user,id:user.id});
        console.log("User Location Updated Successfully");
        res.json({
            message: "",
            userid: user.id,
        })

    } catch (error) {
        console.log(error);
        console.log("Error in updating user location")
        res.status(400).json({
            message: "Error in Updating User Location",
        });
    }
}