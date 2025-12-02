const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/order', orderController.createOrder);
router.get('/order/list', orderController.listOrders);
router.get('/order/:orderId', orderController.getOrderById);
router.put('/order/:orderId', orderController.updateOrder);
router.delete('/order/:orderId', orderController.deleteOrder);

module.exports = router;
