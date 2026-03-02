const jwt = require('jsonwebtoken');

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || 'vgi_cafeteria_admin_secret_2024';

/**
 * adminProtect — verifies the simple admin JWT (separate from Clerk).
 * The token is sent as: Authorization: Bearer <token>
 */
const adminProtect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Admin token required' });
    }

    try {
        const decoded = jwt.verify(token, ADMIN_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        req.adminUser = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired admin token' });
    }
};

module.exports = { adminProtect };
