const update = require('../crud/update.js');
const insert = require('../crud/insert.js');
const get = require('../crud/get.js');
const remove = require('../crud/remove.js');


exports.getAllProducts = async (req,res) => {
  try {
      var products = await get({collection:"Product", by:"all"});
      console.log("All products fetched successfully!")
      res.json({
          products: products,
          error:""
      });
  } catch (error) {
      res.status(400).json({
          error:"Something went Wrong!"+error.message
      })
  }
};


exports.createProduct = async (req,res) => {
  var title = req.body.title;
  var image = req.body.image;
  var content = req.body.content;
  var price = req.body.price;

  newProduct = {title, image, content, price};
  console.log(newProduct);

   try {
      var id = await insert({collection:"Product",data:newProduct});

      console.log("Product Successfully Added!!");

      res.json({
        productId: id,
        product: newProduct,
        error:""
      })
      
  } catch (error) {
      console.log(error.message)
      return res.status(400).json({
          error:error.message
      })
  }
};

exports.deleteProduct = async(req, res) => {
    var productId = req.params.productId;
    try {
        var id = await remove({collection:"Product", id:productId});
        console.log("Product deleted successfully");
        res.json({
            productId: productId,
            message:"",
        });
    } catch (error) {
        return res.status(404).json({
            error:"Something went Wrong!"+error.message
        });
    }
}

exports.getAllReviews = async(req, res) => {
    var productId = req.params.productId;
    try {
        var reviews = await get({collection:"Review",by:"where",where:[{parameter:"productId", comparison:"==", value: productId}]});
        console.log("All reviews fetched successfully");
        res.json({
            reviews: reviews,
            error:""
        });
    } catch(error) {
        res.status(400).json({
            error:"Something went Wrong!"+error.message
        })
    }
}

exports.createReview = async(req, res) => {
    var productId = req.params.productId;
    var userId = req.params.userId;
    var content = req.body.content;
    var ratting = req.body.ratting;
    try {
        var user = await get({collection: "User", by: "id", id: userId});
        var userName = user.name;
        newReview = {productId, userId, userName, content, ratting};
        var id = await insert({collection:"Review", data: newReview});
        console.log("Review Successfully Added!!");
        res.json({
            reviewId: id,
            review: newReview,
            error:""
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error:error.message
        })
    }
};

exports.deleteReview = async(req, res) => {
    var reviewId = req.params.reviewId;
    try {
        var id = await remove({collection:"Review", id:reviewId});
        console.log("Review deleted successfully");
        res.json({
            reviewId: reviewId,
            message:"",
        });
    } catch (error) {
        return res.status(404).json({
            error:"Something went Wrong!"+error.message
        });
    }
}

exports.getAllOrders = async(req, res) => {
    var userId = req.params.userId;
    try {
        var orders = await get({collection:"Order",by:"where",where:[{parameter:"userId", comparison:"==", value: userId}, {parameter:"status", comparison: "==", value: 'not_paid'}]});
        for (let ind = 0; ind < orders.length; ind++) {
            var product = await get({collection: "Product", by:"id", id: orders[ind].productId});
            orders[ind].title = product.title;
            orders[ind].image = product.image;
            orders[ind].price = product.price;
        }
        console.log("All orders fetched successfully");
        res.json({
            orders: orders,
            error:""
        });
    } catch(error) {
        res.status(400).json({
            error:"Something went Wrong!"+error.message
        })
    }
}

exports.createOrder = async(req, res) => {
    var productId = req.params.productId;
    var userId = req.params.userId;
    var quantity = '1';
    var status = "not_paid";
    newOrder = {userId, productId, quantity, status};
    try {
        var order = await get({collection:"Order", by:"where",where:[{parameter:"userId", comparison:"==", value: userId}, {parameter:"productId", comparison:"==", value: productId}, {parameter:"status", comparison: "==", value: "not_paid"}]});
        console.log(order);
        if (!order.length) {
            var id = await insert({collection:"Order", data: newOrder});
            console.log("Order Successfully Added!!");
            res.json({
                orderId: id,
                order: newOrder,
                error:""
            })
        } else {
            console.log("Order already present");
            res.json({
                error: "Order already present"
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error:error.message
        })
    }
}

exports.incOrderQuantity = async(req, res) => {
    var orderId = req.params.orderId;
    try {
        var order = await get({collection:"Order", by:"id", id:orderId});
        order.quantity = (Number(order.quantity) + 1).toString();
        console.log(order);
        var oId = await update({collection:"Order",data: order, id: order.id}) 
        console.log("Order quantity increased successfully!!");
        
        res.json({
          orderId: oId,
          order: order,
          error:""
        });
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error:error.message
        })
    }
}

exports.desOrderQuantity = async(req, res) => {
    var orderId = req.params.orderId;
    try {
        var order = await get({collection:"Order", by:"id", id:orderId});
        if (Number(order.quantity) > 1) {
            order.quantity = (Number(order.quantity) - 1).toString();
            var oId = await update({collection:"Order",data: order, id: order.id}) 
            console.log("Order quantity increased successfully!!");
            res.json({
                orderId: oId,
                order: order,
                error:""
            });
        } else {
            console.log("Quantity must be at least one");
            res.json({
                error: "Quantity must be at least one"
            })
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error:error.message
        })
    }
}


exports.deleteOrder = async(req, res) => {
    var orderId = req.params.orderId;
    try {
        var id = await remove({collection:"Order", id:orderId});
        console.log("Order deleted successfully");
        res.json({
            orderId: orderId,
            message:"",
        });
    } catch (error) {
        return res.status(404).json({
            error:"Something went Wrong!"+error.message
        });
    }
}