const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        console.error('ℹ️  Fix: Whitelist your IP in MongoDB Atlas → Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)');
        process.exit(1);
    }
};

module.exports = connectDB;
