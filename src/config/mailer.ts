const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'sandbox.smtp.mailtrap.io',
    port: '2525',
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
})

export const sendMail = (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: {
            name: "Bag A Bake",
            address: process.env.MAILTRAP_USER
        },
        to: [to],
        subject,
        html
    }

    return transporter.sendMail(mailOptions)
}