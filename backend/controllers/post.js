const update = require('../crud/update.js');
const insert = require('../crud/insert.js');
const get = require('../crud/get.js');
const remove = require('../crud/remove.js');
// const { log } = require('react-native-reanimated');

// fetch posts created by the user
exports.getPostsByUser = async (req,res) => {

    var userid = req.params.userid
    // console.log(userid)
    try {
        var user = await get({collection:"User",by:"id", id: userid})
        var postids = user.posts;

        var posts = []
        if(!postids){
            console.log("NO post")
              res.json({
                error:"No post found" 
            });
        }
        else{
        for(const pid of postids){
            
            try {
                const post = await get({collection:"Post",by:"id",id:pid});
            console.log(post)
            posts.push(post);
            } catch (error) {
                console.log(error);
            }
            
        }
        // posts.sort((a, b) => {
        //     return new Date(b.date) - new Date(a.date);
        //   })
        
        // if(!posts){
        //     console.log("NO post")
        //     return res.status(404).json({
        //         error:"No post found" 
        //     });
        // }
        
            console.log("ko")
            res.json({
                posts: posts,
                error:""
            });
        }
        
    } catch (error) {
        res.status(400).json({
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
        for(const fid of friendids){
            
            const posts = await get({collection:"Post",by:"where",where:[{parameter:"userId", comparison:"==",value:fid}]});
            for(const post of posts){
                allposts.push(post);
            }

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
    var userId = req.body.userId;
    var title = req.body.title;
    var caption = req.body.caption;
    var data = Buffer.from(req.body.base64Data, 'base64');
    var contentType = req.body.imageType
    var photo = {'data':data, 'contentType':contentType }
    post = {userId, title, caption, photo, comments:"", likes:"", report:""};
    console.log(post);

     try {
        var id = await insert({collection:"Post",data:post}) 

        // adding postids  to user's document
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
    // console.log(comment)
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


exports.getPostPhotoRn = (req,res) => {
    var base64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAAB3RJTUUH1QEHDxEhOnxCRgAAAAlwSFlzAAAK8AAACvABQqw0mAAAAXBJREFUeNrtV0FywzAIxJ3+K/pZyctKXqamji0htEik9qEHc3JkWC2LRPCS6Zh9HIy/AP4FwKf75iHEr6eU6Mt1WzIOFjFL7IFkYBx3zWBVkkeXAUCXwl1tvz2qdBLfJrzK7ixNUmVdTIAB8PMtxHgAsFNNkoExRKA+HocriOQAiC+1kShhACwSRGAEwPP96zYIoE8Pmph9qEWWKcCWRAfA/mkfJ0F6dSoA8KW3CRhn3ZHcW2is9VOsAgoqHblncAsyaCgcbqpUZQnWoGTcp/AnuwCoOUjhIvCvN59UBeoPZ/AYyLm3cWVAjxhpqREVaP0974iVwH51d4AVNaSC8TRNNYDQEFdlzDW9ob10YlvGQm0mQ+elSpcCCBtDgQD7cDFojdx7NIeHJkqi96cOGNkfZOroZsHtlPYoR7TOp3Vmfa5+49uoSSRyjfvc0A1kLx4KC6sNSeDieD1AWhrJLe0y+uy7b9GjP83l+m68AJ72AwSRPN5g7uwUAAAAAElFTkSuQmCC';
    var img = Buffer.from(base64, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img); 
}

exports.photo = async (req, res, next) => {
    var postId = req.params.postId;
    try {
        var post = await get({collection: "Post",by:"id",id:postId});
        res.set("Content-Type", post.photo.contentType);
    return res.send(post.photo.data);
    } catch (error) {
        return res.status(404).json({
            error:"Error Fetching Image"+error.message
        })
    }

    
    next();
};