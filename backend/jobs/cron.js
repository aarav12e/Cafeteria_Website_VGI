const cron = require('node-cron');
const Order = require('../models/Order');

const cleanupPendingOrders = () => {
    // Run every hour: '0 * * * *'
    cron.schedule('0 * * * *', async () => {
        console.log('Running Cron Job: Cleanup Pending Orders');
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const result = await Order.deleteMany({
                orderStatus: 'placed',
                paymentStatus: 'pending',
                createdAt: { $lt: twentyFourHoursAgo }
            });

            if (result.deletedCount > 0) {
                console.log(`Deleted ${result.deletedCount} pending orders.`);
            }
        } catch (error) {
            console.error('Error in Cron Job:', error);
        }
    });
};

module.exports = cleanupPendingOrders;
