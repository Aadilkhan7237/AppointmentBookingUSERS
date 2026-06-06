import { userSchema } from "../schema/user.schema.js";
import {model} from "mongoose";


const userModel=model("user",userSchema);


export {userModel};