import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        userMail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export { otpSchema };