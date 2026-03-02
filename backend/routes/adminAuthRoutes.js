const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Hardcoded admin credentials
const ADMIN_USERNAME = 'aarav12ee';
const ADMIN_PASSWORD = 'waterbottle';
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || 'vgi_cafeteria_admin_secret_2024';

// POST /api/admin-auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign(
            { username, role: 'admin' },
            ADMIN_SECRET,
            { expiresIn: '24h' }
        );
        return res.json({ success: true, token, message: 'Admin login successful' });
    }

    return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// GET /api/admin-auth/verify  - verify admin token is still valid
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false });

    try {
        jwt.verify(token, ADMIN_SECRET);
        res.json({ valid: true });
    } catch {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
