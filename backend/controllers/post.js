const update = require('../crud/update.js');
const insert = require('../crud/insert.js');
const get = require('../crud/get.js');
const remove = require('../crud/remove.js');

// fetch posts created by the user
exports.getPostsByUser = async (req,res) => {

    var userid = req.params.userid
    console.log(userid)
    try {
        var user = await get({collection:"User",by:"id", id: userid})
        var postids = user.posts;

        var posts = []
        
        for(const pid of postids){
            const post = await get({collection:"Post",by:"id",id:pid});
            posts.push(post);
        }
        posts.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })
        
        if(!posts){
            return res.status(404).json({
                error:"No post found" 
            });
        }
        else{
            
            res.json({
                posts: posts,
                error:""
            });
        }
        
    } catch (error) {
        return res.status(400).json({
            error:"Something went Wrong!"+error.message
        })
    }
};

// fetch all posts for the user created by the users in his friend's list
exports.getPosts = async (req,res) => {

    var userid = req.params.userid
    try {
        var user = await get({collection:"User",by:"id", id: userid})
        var friendids = user.friends;

        allposts = []
        console.log(friendids)
        for(const fid of friendids){
            
            const posts = await get({collection:"Post",by:"where",where:[{parameter:"userid", comparison:"==",value:fid}]});
            
            for(const post of posts)
            allposts.push(post);
        }
        
        if(!allposts){
            return res.status(404).json({
                error:"No post found" 
            });
        }
        else{
        res.json({
            posts:allposts,
            error:""
        })
    }
    } catch (error) {
        return res.status(400).json({
            error:"Something went Wrong!"
        })
    }
};

// creating post by the user
exports.createPost = async (req,res) => {
    // {userid,photo,title, caption,date, time}
    var post = req.body;
    post = {...post, comments:"", likes:"", report:""};

     try {
        var id = await insert({collection:"Post",data:post}) 

        // adding postids  to user's document
        var user = await get({collection:"User",by:"id", id:post.userid})
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
        return res.status(400).json({
            error:error.message
        })
    }

};

//Adding likes for the  post

//"postId": "Kqp34woQrrpghJ9PfLmW",
exports.like = async (req,res) => {
    
    const {postId} = req.body;     //{postId,}
    try {
        var post = await get({collection: "Post",by:"id",id:postId});
        var like = parseInt(post.likes)
        post.likes = like + 1;
        var id = await update({collection:"Post",data:post, id:post.id}) 
        console.log("successfully liked post!");
        
        res.json({
          postId:id,
          post: post,
          error:""
        })
        
    } catch (error) {
        return res.status(400).json({
            error:error.message
        })
    }
};


// adding comment to the post
exports.comment = async (req,res) => {

    //{ postId, text }
    var comment  = req.body;
    console.log(comment)
    try {
        
        var post = await get({collection: "Post",by:"id",id:comment.postId});
        console.log(post);
        if(post.comment){
            post.comment.push(comment.text);
        }else{
            post.comment = [comment.text];
        }
        console.log(post);
        var pid = await update({collection:"Post",data:post, id:post.id}) 

        console.log("Comment added successfully!!");
        
        res.json({
          postId:pid,
          post:post,
          error:""
        });

    } catch (error) {
        return res.status(404).json({
            error:"Something went Wrong!"+error.message
        })
    }


};


// deleting any of the post
exports.deletePost = async (req,res) => {

    var postId = req.params.postId;
    try {
        var id = await remove({collection:"Post", id:postId});
        console.log("Post deleted successfully");
        res.json({
            postId: postId,
            message:"successfully deleted post"
        })
    } catch (error) {
        return res.status(404).json({
            error:"Something went Wrong!"+error.message
        })
    }
};