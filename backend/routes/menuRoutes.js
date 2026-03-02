const express = require('express');
const router = express.Router();
const {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getMenu);
router.post('/', protect, admin, addMenuItem);
router.put('/:id', protect, admin, updateMenuItem);
router.delete('/:id', protect, admin, deleteMenuItem);

module.exports = router;
