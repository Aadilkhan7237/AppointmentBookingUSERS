import { otpSchema } from "../schema/otp.schema.js";
import { model } from "mongoose";


const otpModel = model("otp", otpSchema);


export { otpModel };