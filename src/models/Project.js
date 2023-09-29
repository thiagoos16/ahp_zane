const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

const ProjectSchema = new Schema({
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

ProjectSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Project', ProjectSchema);