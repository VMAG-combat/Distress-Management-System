const express = require('express')

const { getPostsByUser, createPost, deletePost, like, comment, getPosts} = require('../../controllers/post')

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


module.exports = router;