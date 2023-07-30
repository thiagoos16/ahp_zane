const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name.is.empty'],
    },
    email: {
        type: String,
        unique: [true, 'email.in.use'],
        required: [true, 'email.is.empty'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password.is.empty'],
        select: false,
    },
    passwordResetToken: {
       type: String,
       select: false, 
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

module.exports = mongoose.model('User', UserSchema);