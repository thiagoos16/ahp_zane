const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name.in.use'],
        required: [true, 'name.is.empty'],
    },
    description: {
        type: String,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Project', ProjectSchema);