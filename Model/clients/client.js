/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
    },
    { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
