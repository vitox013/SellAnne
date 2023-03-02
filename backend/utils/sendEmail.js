const nodemailer = require("nodemailer");
const text = require("./text.js");

module.exports = async (email, subject, url, userName) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service: process.env.EMAIL_SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.EMAIL_SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: text(userName, url),
        });

        console.log("Email enviado com sucesso!");
    } catch (error) {
        console.log("Email não enviado!");
        console.log(error);
        return error;
    }
};
