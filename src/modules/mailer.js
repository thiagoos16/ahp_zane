const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const service = process.env.SERVICE;
const port = process.env.PORT;
const pass = process.env.PASS;
const user = process.env.EMAIL;

const transport = nodemailer.createTransport({
    service,
    auth: { user, pass }
});

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./src/resources/mail'),
        layoutsDir: path.resolve('./src/resources/mail'),
        defaultLayout: undefined,
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
}));

module.exports = transport;