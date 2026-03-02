const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        console.error('⚠️  Server will continue running. Fix: Whitelist your IP in MongoDB Atlas → Network Access → Allow Anywhere (0.0.0.0/0)');
        // DO NOT exit - admin login doesn't need MongoDB
    }
};

module.exports = connectDB;
