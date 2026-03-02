const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Use Clerk's middleware to verify the token
const requireAuth = ClerkExpressRequireAuth();

// Custom middleware to attach MongoDB User to req.user
const protect = async (req, res, next) => {
    // Run Clerk verification first
    requireAuth(req, res, async (err) => {
        if (err) return next(err);

        try {
            const { userId: clerkId } = req.auth;

            // Find user in DB
            let user = await User.findOne({ clerkId });

            if (!user) {
                // Fallback: If sync endpoint wasn't called, we might fail or try to create?
                // For now, let's return 401 if user not synced, or handle it.
                // Better: Client should ensure sync. But to be safe:
                return res.status(401).json({ message: 'User not synchronized with database' });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ message: 'Server Error in Auth' });
        }
    });
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
