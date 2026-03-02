require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const promoteAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Get email from command line arg
        const email = process.argv[2];

        if (!email) {
            console.log('Usage: node promoteAdmin.js <email_to_promote>');
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`SUCCESS: User ${email} is now an ADMIN.`);
        } else {
            console.log(`ERROR: User ${email} not found. Please log in first to create the user record.`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

promoteAdmin();
