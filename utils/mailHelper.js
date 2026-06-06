import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || "aadiluser2002@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendMail = async ({
    email,
    subject,
    msg,
    text = "",
}) => {
    try {

        await transporter.verify();
        console.log("SMTP connection successful");

        const info = await transporter.sendMail({
            from: `"MKHospital" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html: msg,
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Mail Error:", error);

        return {
            success: false,
            error: error.message,
        };
    }
};