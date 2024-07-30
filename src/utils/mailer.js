import nodemailer from 'nodemailer'
import ENV from '../config/server-config.js'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.email',
    port: 587,
    service: 'gmail',
    secure: false,
    auth: {
        user: ENV.SENDER_EMAIL,
        pass: ENV.SENDER_PASS,
    },
});

export async function main(user_email, otp) {
    // console.log(user_email)
    const info = await transporter.sendMail({
        from: ENV.SENDER_EMAIL,
        to: user_email,
        subject: "Email Verification",
        text: "Hello world?",
        html: `<b>Your system generated otp for email verification is ${otp}. Don't share it with anyone.</b>`,
    });
    console.log(info);
    return info.messageId
}

main().catch(console.error);