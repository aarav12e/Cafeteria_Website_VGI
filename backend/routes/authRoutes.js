const express = require('express');
const router = express.Router();
const { syncUser } = require('../controllers/authController');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Create a simple protected route just for sync
router.post('/sync', ClerkExpressRequireAuth(), syncUser);

module.exports = router;
