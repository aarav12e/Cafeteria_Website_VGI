const User = require('../models/User');
const { users } = require('@clerk/clerk-sdk-node');

// @desc    Sync Clerk User to MongoDB
// @route   POST /api/auth/sync
// @access  Private (Clerk Token)
const syncUser = async (req, res) => {
    try {
        const { userId: clerkId } = req.auth;

        // Fetch user details from Clerk
        const clerkUser = await users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0].emailAddress;
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

        let user = await User.findOne({ clerkId });

        if (user) {
            // Update details
            user.email = email;
            user.name = name;
            await user.save();
        } else {
            // Create new
            user = await User.create({
                clerkId,
                email,
                name,
                role: 'user' // Default role
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { syncUser };
