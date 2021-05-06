class Review {
  constructor(id, productId, userId, userName, content, ratting) {
          this.id = id;
          this.productId = productId;
          this.userId = userId;
          this.userName = userName;
          this.content = content;
          this.ratting = ratting;
  }
}

module.exports = Review;