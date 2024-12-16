const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'jkt17.dewaweb.com',
    port: '465',
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

export const sendMail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: {
            name: "Bag A Bake",
            address: process.env.MAIL_USER
        },
        to: [to],
        subject,
        html
    };

    return await transporter.sendMail(mailOptions);
};