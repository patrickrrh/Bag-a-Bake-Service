"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'sandbox.smtp.mailtrap.io',
    port: '2525',
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});
const sendMail = (to, subject, html) => {
    const mailOptions = {
        from: {
            name: "Bag A Bake",
            address: process.env.MAILTRAP_USER
        },
        to: [to],
        subject,
        html
    };
    return transporter.sendMail(mailOptions);
};
exports.sendMail = sendMail;
