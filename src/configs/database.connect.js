//Connect to MongoDB
const mongoose = require('mongoose');

const connect = async () => {
    try {
        console.log(process.env.MONGODB_URL);
        console.log(process.env.PORT);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Could not connect to MongoDB...', err);
    }
};

module.exports = connect;