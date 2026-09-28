import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_HOST),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendMail = async ({
    to,
    subject,
    text,
    html,
}) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
    };

    return await transporter.sendMail(mailOptions);
}