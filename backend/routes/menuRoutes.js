const express = require('express');
const router = express.Router();
const {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');
const { protect } = require('../middlewares/authMiddleware');
const { adminProtect } = require('../middlewares/adminMiddleware');

// Public - anyone can view menu
router.get('/', getMenu);

// Admin only - requires admin JWT login
router.post('/', adminProtect, addMenuItem);
router.put('/:id', adminProtect, updateMenuItem);
router.delete('/:id', adminProtect, deleteMenuItem);

module.exports = router;
