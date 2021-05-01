const update = require("../crud/update.js");
const get = require("../crud/get.js");
var clustering = require('density-clustering');

exports.getNearestUsers = async (req, res) => {
  // const {userid, latitude, longitude } = req.params;
  
  const userid = req.params.userid;
  const latitude = req.params.latitude;
  const longitude = req.params.longitude;
  try {
    
    // console.log(req.body);
    var users = await get({
      collection: "User",
      by: "where",
      where: [
        { parameter: "latitude", value: latitude + 0.05, comparison: "<=" },
        { parameter: "latitude", value: latitude - 0.05, comparison: ">=" },
      ],
    });
    var users2 = await get({
      collection: "User",
      by: "where",
      where: [
        { parameter: "longitude", value: longitude + 0.05, comparison: "<=" },
        { parameter: "longitude", value: longitude - 0.05, comparison: ">=" },
      ],
    });
    // users = Array(users);

    
    users = users.filter((user) => {
      
      if (user.id === userid) {
        return false;
      }
      for (var i = 0; i < users2.length; i++) {
        // }
        // users2.map(user2=>{

        if (user.id === users2[i].id) {
          return true;
        }
      }
      return false;
    });
  
    // console.log(users);
    return res.json({ users: users });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.toString());
  }
};

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
  // console.log(newuser);
  try {
    var user = await get({ collection: "User", by: "id", id: newuser.userid });
    // console.log(user);
    user.longitude = newuser.longitude;
    user.latitude = newuser.latitude;
    var id = await update({ collection: "User", data: user, id: user.id });
    console.log("User Location Updated Successfully", new Date().toLocaleTimeString());
    var incidents = await get({collection:"Incident",by:"where",where:[{parameter:"status", comparison:"!=",value: "false"}]})
   
    var dataset=[]
    for(var incident of incidents){
      var latlong=[]
        
        latlong.push(incident.latitude)
        
        latlong.push(incident.longitude)

        dataset.push(latlong)

    };
    // console.log(dataset)
    var data={};

    var optics = new clustering.OPTICS();
      // parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
      var clusters = optics.run(dataset, 6, 2);

      for(var cluster of clusters){
        var lat=0.0;
        var long=0.0;
        var mean=[];
        for(var i of cluster){
          lat += parseFloat(dataset[i][0])
          long += parseFloat(dataset[i][1])
        }
        mean.push(lat/cluster.length)
        mean.push(long/cluster.length)
        data[mean] = cluster.length
      }
      var hotspot=false
      var center =[]
      console.log(incidents)
      for(var key in data){
        // console.log(parseFloat(key.substring(key.indexOf(',')+1)))
        // console.log(parseFloat(key.substring(0,key.indexOf(',')))-newuser.latitude,parseFloat(key.substring(key.indexOf(',')+1))-newuser.longitude)
        var meanLat = parseFloat(key.substring(0,key.indexOf(',')));
        var meanLong = parseFloat(key.substring(key.indexOf(',')+1));
        if(Math.abs(meanLat-newuser.latitude)<=0.05 && Math.abs(meanLong-newuser.longitude)<=0.05 && data[key]>=3)
        {
          hotspot=true
          center.push(meanLat)
          center.push(meanLong)
        }

      }
    
    
    res.json({
      message: "",
      userid: user.id,
      hotspot:hotspot,
      center:center
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
    // var user2 = await get({ collection: "User", by: "id", id: friendId });
    // if (user2.friends) {
    //   user2.friends.push(userId);
    // } else {
    //   user2.friends = [userId];
    // }
    // var fid = await update({ collection: "User", data: user2, id: user2.id });
    // console.log("User added in friends's list");

    res.json({
      userid: id,
      
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

exports.getFollowUsers = async (req,res) => {
  var userid = req.params.userid;
  // console.log(userid)
  try {
    var user = await get({ collection: "User", by: "id", id: userid });
    
    var friendids = user.friends;
    var allusers = await get({collection: "User", by:"where", where:[{parameter:"id", comparison:"!=",value:userid}]})
    // console.log(users)
    followlist = []
    for(const u of allusers){
      if(!friendids.includes(u.id))
      followlist.push(u)
    }
    
    res.json({
      users: followlist,
      error: ""
    })
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
}

exports.getAllUsers = async (req,res) => {
  var userid = req.params.userid;
  
  try {
    
    var allusers = await get({collection: "User", by:"where", where:[{parameter:"id", comparison:"!=",value:userid}]})
    
    
    res.json({
      users: allusers,
      error: ""
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      error: error.message,
    });
  }
}

exports.addEmergencyContacts = async (req, res) => {
  //{userId, friendId}
  var { userId, emergencyContacts } = req.body;
  try {
    var user = await get({ collection: "User", by: "id", id: userId });
    // adding user2 to user1's friend list
    for(const contact of emergencyContacts){
    if (user.emergencyContacts) {
      user.emergencyContacts.push({
        "name":contact.name,
        "phoneno":contact.numbers[0]
      });
    } else {
      user.emergencyContacts = [{
        "name":contact.name,
        "phoneno":contact.numbers[0]
      }];
    }
  }
    var id = await update({ collection: "User", data: user, id: user.id });
    console.log("Emergency Contacts Added Succesfully");

    console.log(user)
    // adding user1 to user2's friend list
    // var user2 = await get({ collection: "User", by: "id", id: friendId });
    // if (user2.friends) {
    //   user2.friends.push(userId);
    // } else {
    //   user2.friends = [userId];
    // }
    // var fid = await update({ collection: "User", data: user2, id: user2.id });
    // console.log("User added in friends's list");

    res.json({
      userid: id,
      
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in Adding Contacts",
    });
  }
};