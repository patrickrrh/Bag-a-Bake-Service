"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const sendMail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: {
            name: "Bag A Bake",
            address: process.env.MAIL_USER
        },
        to: [to],
        subject,
        html
    };
    return yield transporter.sendMail(mailOptions);
});
exports.sendMail = sendMail;
