const update = require('../crud/update.js');
const insert = require('../crud/insert.js');
const get = require('../crud/get.js');
const remove = require('../crud/remove.js');

// fetch evenys created by the user
exports.getEventsByUser = async (req,res) => {

    var userid = req.params.userid;
    // console.log(userid)
    try {
        var events = await get({collection:"Event",by:"where",where:[{parameter:"userid", comparison:"==",value:userid}]});

        if(!events.length){
            console.log("NO events")
              res.json({
                error:"No events found" 
            });
        }
        else{
        
            console.log("Events of the user found successfully!")
            res.json({
                events: events,
                error:""
            });
        }
        
    } catch (error) {
        res.status(400).json({
            error:"Something went Wrong!"+error.message
        })
    }
};

exports.getAllEvents = async (req,res) => {

    // console.log(userid)
    var userid = req.params.userid;
    var currentDate = new Date();
    try {
        var events = await get({collection:"Event",by:"where",where:[{parameter:"userid", comparison:"!=", value:userid}]});

        if(!events.length){
            console.log("NO upcoming events found");
              res.json({
                error:"No upcoming events found" 
            });
        }
        else{
        
            console.log("Events found successfully!")
            res.json({
                events: events,
                error:""
            });
        }
        
    } catch (error) {
        res.status(400).json({
            error:"Something went Wrong!"+error.message
        })
    }
};

exports.searchEventsByParameter = async (req,res) => {

    // event can be searched by title/caption/date/organiser
    var userid = req.params.userid;
    var field = req.params.field;
    var fieldValue = req.params.value;
    var foundEvents = [];
    try {
        if(field == "organiser"){
            foundEvents = await get({collection:"Event",by:"where",where:[{parameter:"organiser", comparison:"==",value:fieldValue}]});
        }else if(field == "date"){
            var events = await get({collection:"Event",by:"where",where:[{parameter:"userid", comparison:"!=",value:userid}]});
            events.forEach(eve => {
                if(eve.date._seconds){
                    foundEvents.push(eve);
                }else{
                    var date = new Date(eve.date);
                    var cdate = new Date(fieldValue);
                    if(date>cdate){
                        foundEvents.push(eve);
                    }
                }
            });
        }else{
            var events = await get({collection:"Event",by:"where",where:[{parameter:"userid", comparison:"!=",value:userid}]});
            events.forEach(eve => {
                if(eve.title.toLowerCase().includes(fieldValue.toLowerCase()) || eve.caption.toLowerCase().includes(fieldValue.toLowerCase())){
                    foundEvents.push(eve);
                }
            });
        }

        if(!foundEvents.length){
            console.log("NO events found");
              res.json({
                error:"No events found",
                count:'0' ,
            });
        }
        else{
        
            console.log("Events found successfully!")
            res.json({
                events: foundEvents,
                error:""
            });
        }
        
    } catch (error) {
        res.status(400).json({
            error:"Something went Wrong!"+error.message
        })
    }
};

// creating event by the user
exports.createEvent = async (req,res) => {
    // {userid,photo,title,caption,dd,mm,yyyy,time,link,organiser,imagebase64}
    var userid = req.body.userid;
    var title = req.body.title;
    var caption = req.body.caption;
    var link = req.body.link;
    var dd = req.body.dd;
    var mm = req.body.mm;
    var yyyy = req.body.yyyy;
    var time = req.body.time;
    var organiser = req.body.organiser;
    //var data = Buffer.from(req.body.base64Data, 'base64');
    //var contentType = req.body.imageType
    //var photo = {'data':data, 'contentType':contentType }
    var photo = req.body.photo;
    var imagebase64 = req.body.imagebase64;

    //var date = new Date(yyyy,mm,dd);
    var date = dd+'/'+mm+'/'+yyyy;
    newEvent = {userid, title, caption, photo, imagebase64, date, time, organiser, link, registered:[]};
    console.log(newEvent);

     try {
        var id = await insert({collection:"Event",data:newEvent}) 

        // adding eventids  to user's document
        var user = await get({collection:"User",by:"id", id:newEvent.userid})
        if(user.events){
            user.events.push(id);
        }else{
            user.events = [id];
        }
        var uid = await update({collection: "User", data:user,id:user.id});

        console.log("Event Created Successfully!!");

        res.json({
          eventId: id,
          event: newEvent,
          error:""
        })
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error:error.message
        })
    }

};

exports.createEventPost = async (req,res) => {
    // {userid,photo,title,caption,dd,mm,yyyy,time,link,organiser}
    var userId = req.body.userid;
    var title = req.body.title;
    var caption = req.body.caption;
    var date = req.body.dd + "/"+req.body.mm+"/"+req.body.yyyy;
    var description = "Date: "+date+ "\nOrganised By: "+req.body.organiser+" \nLink: "+req.body.link;
    //var data = Buffer.from(req.body.base64Data, 'base64');
    //var contentType = req.body.imageType
    //var photo = {'data':data, 'contentType':contentType }
    var photo = req.body.photo;
    post = {userId, title, caption, photo, comments:"", likes:"", report:"", description};
    console.log(post);

     try {
        var id = await insert({collection:"Post",data:post}) 

        /// adding postids  to user's document
        var user = await get({collection:"User",by:"id", id:post.userId})
        if(user.posts){
            user.posts.push(id);
        }else{
            user.posts = [id];
        }
        var uid = await update({collection: "User", data:user,id:user.id});

        console.log("Post Created Successfully!!");

        res.json({
          postId: id,
          post: post,
          error:""
        })
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error:error.message
        })
    }

};

exports.registerEvent = async (req,res) => {
    
    var userid = req.params.userid;
    var eventid = req.params.eventid;
    var cont = 1;
    try {
        var user = await get({collection:"User",by:"id", id:userid});
        var event = await get({collection:"Event",by:"id", id:eventid});      

        if(user.registeredEvents){
            if(!user.registeredEvents.includes(eventid)){
                user.registeredEvents.push(eventid);
            }else{
                cont = 0;
                return res.json({
                    message:'registered already'
                });
            }
        }else{
            user.registeredEvents = [eventid];
        }
        if(cont!=0){
            event.registered.push({userid:user.id, name: user.name, email:user.email});

            var uid = await update({collection: "User", data:user,id:user.id});
            var eid = await update({collection: "Event", data:event,id:event.id});

            const organiserId = event.userid;
            const organiser = await get({collection:"User",by:"id", id:organiserId});
            const oemail = organiser.email;

            console.log("User registered for event successfully!");
            res.status(200).json({
                message:"",
                eventid,
                userid,
                oemail:oemail,
            });
        }
        
    } catch (error) {
        console.log("Error in registering user for event");
        res.status(400).json({
            message: "Error in registering user for event"
        });
    }

};

// deleting any of the event
exports.deleteEvent = async (req,res) => {
    console.log("Delete event called");
    var eventid = req.params.eventid;
    console.log("Delete event id: "+eventid);
    try {
        var id = await remove({collection:"Event", id:eventid});
        console.log("Event deleted successfully");
        res.json({
            eventid: eventid,
            message:"",
        });
    } catch (error) {
        return res.status(404).json({
            error:"Something went Wrong!"+error.message
        });
    }
};


