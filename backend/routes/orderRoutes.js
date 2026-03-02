const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { adminProtect } = require('../middlewares/adminMiddleware');

// User routes - requires Clerk auth
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// Admin routes - requires admin JWT login  
router.get('/admin', adminProtect, getAllOrders);
router.put('/:id/status', adminProtect, updateOrderStatus);

module.exports = router;
