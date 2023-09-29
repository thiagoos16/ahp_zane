
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

module.exports = {
    async register(req, res) {
        const { email } = req.body;

        try {
            if (await User.findOne({email})) {
                return res.status(400).send({ error: 'user.already.registred'});
            }

            const user = await User.create(req.body);

            user.password = undefined;

            const token = generateToken({ id: user.id });

            return res.send({ user, token });
        } catch(err) {
            return res.status(400).send({error: err });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) 
            return res.status(404).send({ error: 'user.not.found'});

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'invalid.password'});

        user.password = undefined;

        const token =  generateToken({ id: user.id });

        res.send( { user, token } ); 
    },

    async profile(req, res) {
        console.log(req.userId);
        const { userId }  = req.userId;

        const user = await User.findOne( { userId } );

        if (!user)
            return res.status(404).send({ error: 'user.not.found' });

        res.send({ user });
    },

    async forgot_password(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user)
                return res.status(404).send({ error: 'user.not.found' });

            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });

            mailer.sendMail({
                from: 'senderbrainiac@gmail.com',
                to: email,
                template: 'auth/forgot_password',
                context: { token }
            }, (err) => {
                if (err)
                    return res.status(400).send({ error: 'cannot.send.forgot.password.email' });

                return res.send();
            });
        } catch (err) {
            res.status(400).send({ error: 'error.on.forgot.password' });
        }
    },

    async reset_password(req, res) {
        const { email, token, password } = req.body;

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires');

            if (!user)
                return res.status(400).send({ error: 'user.not.found'});

            if (token !== user.passwordResetToken)
                return res.status(400).send({ error: 'token.invalid' });

            const now = new Date();

            if (now > user.passwordResetExpires)
                return res.status(400).send({ error: 'token.expired' });

            user.password = password;
            user.passwordResetToken = null;
            user.passwordResetExpires = null;

            await user.save();

            res.send();

        } catch (error) {
            res.status(400).send({ error: 'cannot.reset.password' });
        }
    }
}

function generateToken(params = {}) {
    return jwt.sign({ params }, process.env.SECRET, {
        expiresIn: 86400,
    });
}