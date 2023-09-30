const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

const ParamaterSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'name.in.use'],
        required: [true, 'name.is.empty'],
    },
    description: {
        type: String,
        lowercase: true,
    },
    projects: [{
        code: {
            type: String
        },
        projectBase: {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'projects'
            },
            name: {
                type: String
            }
        },
        projectSequent: {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'projects'
            },
            name: {
                type: String
            }
        },
        value: {
            type: Number
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

ParamaterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Paramater', ParamaterSchema);