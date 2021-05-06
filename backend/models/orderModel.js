class Order {
  constructor(id, userId, productId, quantity, status, date, received) {
          this.id = id;
          this.userId = userId;
          this.productId = productId;
          this.quantity = quantity;
          this.status = status;
          this.date = date;
          this.received = received;
  }
}
module.exports = Order;