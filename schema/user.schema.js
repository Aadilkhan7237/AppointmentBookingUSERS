import mongoose, {Schema} from "mongoose"


const userSchema=new Schema({
    email:{type:String,required:true,unique:true},
    fullName:{type:String ,required:true},
    password:{type:String ,required:true},
    joinDate:{type:Date,required:true},
    activeStatus:{type:Boolean, default:true},
    otp:{type:Number},
});

export {userSchema};