const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);