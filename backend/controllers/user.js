const update = require("../crud/update.js");
const get = require("../crud/get.js");

exports.editprofile = async (req, res) => {
  const user = req.body;
  //module.exports = async (obj = { collection: "string", data: {}, id: "string" }) => {
  // console.log(user);
  try {
    var id = await update({ collection: "User", data: user, id: user.id });
    console.log("User Profile Updated Successfully");
    res.json({
      message: "",
      user: user,
    });
  } catch (error) {
    console.log(error);
    console.log("Error in updating");
    res.status(400).json({
      message: "Error in Updating User Profile",
    });
  }
};

exports.getprofile = async (req, res) => {
  const id = req.params.userid;
  // console.log(id);
  try {
    var user = await get({ collection: "User", by: "id", id: id });
    console.log("user profile fetched succesfully");
    res.json({
      message: "",
      user: user,
    });
  } catch (error) {
    console.log("Error in fetching profile");
    res.status(400).json({
      message: "Error in fetching profile",
    });
  }
};

exports.updatelocation = async (req, res) => {
  // req.body should have {userid, latitude, longitude}
  var newuser = req.body;
  console.log(newuser);
  try {
    var user = await get({ collection: "User", by: "id", id: newuser.userid });
    console.log(user);
    user.longitude = newuser.longitude;
    user.latitude = newuser.latitude;
    var id = await update({ collection: "User", data: user, id: user.id });
    console.log("User Location Updated Successfully");
    res.json({
      message: "",
      userid: user.id,
    });
  } catch (error) {
    console.log(error);
    console.log("Error in updating user location");
    res.status(400).json({
      message: "Error in Updating User Location",
    });
  }
};

// controller for updating friends list for the users

//second userid : qIg58mULHGfi5piowC32
exports.addFriends = async (req, res) => {
  //{userId, friendId}
  var { userId, friendId } = req.body;
  try {
    var user = await get({ collection: "User", by: "id", id: userId });
    // adding user2 to user1's friend list
    if (user.friends) {
      user.friends.push(friendId);
    } else {
      user.friends = [friendId];
    }
    var id = await update({ collection: "User", data: user, id: user.id });
    console.log("Friend added in user's list");

    // adding user1 to user2's friend list
    var user2 = await get({ collection: "User", by: "id", id: friendId });
    if (user2.friends) {
      user2.friends.push(userId);
    } else {
      user2.friends = [userId];
    }
    var fid = await update({ collection: "User", data: user2, id: user2.id });
    console.log("User added in friends's list");

    res.json({
      user: user,
      friend: user2,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in Adding Friends",
    });
  }
};

exports.getFriends = async (req, res) => {
  var userid = req.params.userid;
  console.log(userid);
  try {
    var user = await get({ collection: "User", by: "id", id: userid });
    console.log(user);
    var friendids = user.friends;

    friends = [];

    if (!friendids) {
      return res.status(404).json({
        error: "No Friends Found!!",
      });
    } else {
      for (const fid of friendids) {
        const friend = await get({ collection: "User", by: "id", id: fid });

        friends.push(friend);
      }
      res.json({
        friends: friends,
        error: "",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
