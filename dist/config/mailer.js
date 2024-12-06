"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'jkt17.dewaweb.com',
    port: '465',
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
const sendMail = (to, subject, html) => {
    const mailOptions = {
        from: {
            name: "Bag A Bake",
            address: process.env.MAIL_USER
        },
        to: [to],
        subject,
        html
    };
    return transporter.sendMail(mailOptions);
};
exports.sendMail = sendMail;
