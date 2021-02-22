class Comment {
    constructor(id, userId, itemId, postId, review,
        photo, likes, dislikes, rating ) {
            this.id = id;
            this.userId = userId;
            this.itemId = itemId;
            this.postId = postId;
            this.review = review;
            this.photo = photo;
            this.likes = likes;
            this.dislikes = dislikes;
            this.rating = rating;
    }
}

module.exports = Comment;