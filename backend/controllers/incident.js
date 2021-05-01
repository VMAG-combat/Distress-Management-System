const insert = require('../crud/insert.js');
const update = require('../crud/update.js');
const get = require('../crud/get.js');
const e = require('express');

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    return dist
}

//comparer function
function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
} 

exports.registerIncident = async (req, res) => {

    //req.body is of the form: {userid,longitude,latitude,datetime,status:'active'}
    var incident = req.body;
    incident = {...incident, helpers:"",evidence:""}

    try {
        //saving new incident to incident database
        var id = await insert({collection:"Incident",data:incident}) 

        //adding incident id to the list of incidents of the current user
        var user = await get({collection:"User",by:"id", id:incident.userid})
        if(user.incidents){
            user.incidents.push(id);
        }else{
            user.incidents = [id];
        }
        var uid = await update({collection: "User", data:user,id:user.id});

        console.log("Incident logged successfully!");

        //fetching top 5 nearby users using radial distance
        // var allusers = await get({collection:"User",by:"where",where:[{parameter:"latitude", comparison:">",value:"0"}]})

        // distUsers = [];

        // allusers.forEach(u => {
        //     dis = distance(parseInt(incident.latitute), parseInt(incident.longitude), parseInt(u.latitude), parseInt(u.longitude));
        //     u.dist = dis;
        //     distUsers.push(u);
        // });
        var users = await get({
            collection: "User",
            by: "where",
            where: [
              { parameter: "id", value: incident.userid , comparison: "!=" },
            //   { parameter: "latitude", value: incident.latitute - 0.05, comparison: ">=" },
            ],
          });
          var users2 = await get({
            collection: "User",
            by: "where",
            where: [
              { parameter: "longitude", value: incident.longitude + 0.05, comparison: "<=" },
            //   { parameter: "longitude", value: incident.longitude - 0.05, comparison: ">=" },
            ],
          });
          // users = Array(users);
      
        //   console.log(users)
        //   console.log(users2)
          
          users = users.filter((user) => {
            
           if(user.latitude && user.longitude && Math.abs(incident.latitude-user.latitude)<=0.5 && Math.abs(incident.longitude-user.longitude)<=0.5)
            return true
            return false;
          });
        //sorting in ascending order
        // distUsers.sort(GetSortOrder("dist")); //Pass the attribute to be sorted on    

        // nearbyUsers = [distUsers[0],distUsers[1],distUsers[2],distUsers[3],distUsers[4]]
        //nearbyUsers = [distUsers[0],distUsers[1]]

        console.log(users.length)
        res.json({
            message:"",
            incident: incident,
            // incidentId: id,
            helpers: users
        });
    } catch (error) {
        console.log(error);
        console.log("Error in logging incident!");
        res.status(400).json({
            message: "Error in logging incident"
        });
    }
    
}

exports.updateIncident = async (req, res) => {

    // req.body should be of the form: {incidentId, helpers}
    // where helpers is the array of email ids of users who helped
    var newIncident = req.body

    try {
        var incident = await get({collection:"Incident",by:"id", id:newIncident.incidentId})
        incident.helpers = newIncident.helpers;
        incident.status = "rectified";
        var id = await update({collection: "Incident", data:incident,id:incident.id});
        console.log("Incident updated Successfully");

        //add incident id to the helped list of each helper
        
        for (const email of newIncident.helpers) {
            var helper = await get({collection:"User",by:"where",where:[{parameter:"email", comparison:"==",value:email}]})
            console.log(helper);
            helper[0].helped.push(id);
            helper[0].points = ((parseInt(helper[0].points)||0)+100).toString();
            var id = await update({collection: "User", data:helper[0],id:helper[0].id});            
          }
        console.log("Helper profiles updated successfully!");

        res.json({
            message:"",
            incidentId: id,
        });

    } catch (error) {
        console.log(error);
        console.log("Some error occured during Incident updation");
        res.status(400).json({
            message: "Some error occured during incident updation"
        });
    }

}

exports.deactivateIncident = async (req, res) => {
    
    //req.body should just have the incident id of the incident to be deactivated
    var id = req.body.id;

    try {
        var incident = await get({collection:"Incident",by:"id", id: id})
        incident.status = "false";
        var id = await update({collection: "Incident", data:incident,id:incident.id});
        console.log("Incident deactivated successfully!");
        res.json({
            message:"",
            id:id
        });

    } catch (error) {
        console.log(error);
        console.log("Error in deactivating incident");
        res.status(400).json({
            message:"Error in deactivating incident",
        });
    }
}

exports.getIncidentsByUser = async (req, res) => {

    var userid = req.params.userid;

    try {
        var user = await get({collection:"User",by:"id", id: userid})
        var incidentids = user.incidents; //array of incident ids of the current user
        
        var incidents = []
        var incident;
    
        for (const iid of incidentids) {
            incident = await get({collection:"Incident",by:"id", id: iid});
            incidents.push(incident);            
          }

        console.log("Incidents of the user fetched successfully");
        
        res.json({
            message:"",
            incidents: incidents,
        });

    } catch (error) {
        console.log(error);
        console.log("Error in fetching incidents by userid");
        res.status(400).json({
            message:"Error in fetching incidents by userid",
        });
    }
}

exports.getAllActiveIncidents = async (req, res) => {

    try {
        var incidents = await get({collection:"Incident",by:"where",where:[{parameter:"status", comparison:"==",value: "active"}]})

        console.log("All active incidents fetched successfully!");
        res.json({
            message:"",
            incidents: incidents,
        });

    } catch (error) {
        console.log(error);
        console.log("Error in fetching active incidents");
        res.status(400).json({
            message: "Error in fetching active incidents"
        });
    }
}