const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
