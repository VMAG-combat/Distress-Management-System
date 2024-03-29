const express = require('express')

const { createProduct, getAllProducts, getAllReviews, createReview, deleteReview, deleteProduct, getAllOrders, createOrder, deleteOrder, incOrderQuantity, desOrderQuantity, orderStatusUpdate, getMyOrders, orderReceived} = require('../controllers/store');

const router = express.Router();

router.get("/getAllProducts", getAllProducts);

router.get('/getAllReviews/:productId', getAllReviews);

router.get('/getAllOrders/:userId', getAllOrders);

router.get('/getMyOrders/:userId', getMyOrders);

router.post('/createProduct', createProduct);

router.post("/deleteProduct/:productId", deleteProduct);

router.post('/createReview/:productId/:userId', createReview);

router.post("/deleteReview/:reviewId", deleteReview);

router.post('/createOrder/:productId/:userId', createOrder);

router.post('/incOrderQuantity/:orderId', incOrderQuantity);

router.post('/desOrderQuantity/:orderId', desOrderQuantity);

router.post("/deleteOrder/:orderId", deleteOrder);

router.post("/orderStatusUpdate/:orderId", orderStatusUpdate);

router.post("/orderReceived/:orderId", orderReceived);

module.exports = router;