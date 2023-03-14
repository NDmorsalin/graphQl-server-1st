/* eslint-disable prettier/prettier */

const mongoose = require('mongoose');

const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('remote connection established');
    } catch (err) {
        console.log(err);
    }
};
module.exports = main;
