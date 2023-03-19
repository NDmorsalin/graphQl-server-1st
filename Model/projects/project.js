/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {

        name: {
            type: String
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed']
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        },
    },
    { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
