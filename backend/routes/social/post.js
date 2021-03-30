const express = require('express')

const { getPostsByUser, createPost, deletePost, like, comment, getPosts, photo,getPostPhotoRn} = require('../../controllers/post')

const { createPostValidator } = require('../../validator/index');

const router = express.Router();

router.get('/myposts/:userid', getPostsByUser);

router.get("/getposts/:userid",getPosts);


//like 
router.put("/post/like",  like);

//comments
router.put("/post/comment",  comment);

router.post("/createPost", createPost, createPostValidator);

router.delete("/post/:postId", deletePost);

//post's photo
router.get("/post/photo/:postId", photo);
router.get("/post/rn/new", getPostPhotoRn);

module.exports = router;