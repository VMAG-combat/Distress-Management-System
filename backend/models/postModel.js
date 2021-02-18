class Post {
    constructor(id, postId, userId, comments, likes,
        photo, caption, date, time, report ) {
            this.id = id;
            this.postId = postId;
            this.userId = userId;
            this.comments = comments;
            this.likes = likes;
            this.photo = photo;
            this.caption = caption;
            this.date = date;
            this.time = time;
            this.report = report;
    }
}

module.exports = Post;