const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    variants: [{
        name: String,
        price: Number
    }],
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
        required: false,
        default: ''
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
