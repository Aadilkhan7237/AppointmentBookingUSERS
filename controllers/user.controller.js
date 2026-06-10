import status from "http-status";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
// import { client } from "../RedisCache/client.js"; // shared folder remains at BACKEND/RedisCache
import validator from "validator";
import { generateOTP, addMessageToQueue } from "../utils/otpNotificationProducer.js";
import { Oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
import { domains } from "googleapis/build/src/apis/domains/index.js";
import { otpModel } from "../models/otp.model.js";







export const googleAuthentication = async (req, res) => {

  // try {
  //    const user=new userModel({
  //     userName:"aadil khan",
  //     fullName:'aadil',
  //     password:"dfdffd",
  //     email:"example@gmail.com",
  //    });

  //    await user.save();


  //  return  res.status(200).json({message:"success"});
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({message:"Error"});
  // }
  console.log("recieved request");
  // const {code}=req.query;



  try {
    const { code } = req.query;

    console.log("BACKEND RECIEVING THIS CODE =>", code);

    const googleRes = await Oauth2Client.getToken(code);

    Oauth2Client.setCredentials(googleRes.tokens);


    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);


    console.log(userInfo.data.email);
    console.log(userInfo.data.name);
    console.log(userInfo.data.given_name);

    let userID = "";
    const googleUserExists = await userModel.findOne({ email: userInfo.data.email });




    if (!googleUserExists) {
      const newUser = new userModel({
        fullName: userInfo.data.given_name,
        email: userInfo.data.email,
        password: process.env.GOOGLE_USERS_PASS,
        joinDate: new Date(Date.now()),
      });

      console.log("user does not exist");
      console.log(googleUserExists);
      const savedUser = await newUser.save();
      console.log("User created");
      userID = savedUser._id;
    } else {

      if (googleUserExists.activeStatus === false) {
        return res.status(401).json({ message: "User is DEACTIVATED by admin" });
      }

      console.log("User already exists just logged him in");
      userID = googleUserExists._id;
    }

    const token = jwt.sign({ userId: userID }, process.env.SECRET, {
      algorithm: "HS512",
      expiresIn: "1h",
    });
    console.log(token);
    const isProduction = process.env.NODE_ENV === "production";

    console.log('NODE_ENV in OAuth:', process.env.NODE_ENV);
    console.log('isProduction in OAuth :', isProduction);
    console.log('FRONTEND_URL in OAuth :', process.env.FRONTEND_URL);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "lax",
      path: "/",
    });
    res
      .status(status.OK)
      .json({ message: "User logged in successfully", id: nanoid() });



  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(500).json({ message: "User already registerd with this mail try with your username and password" });
    }
    res.status(500).json({ message: "Internal Server Error" });

  }



}




export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }


    if (email.slice(email.length - 10) !== "@gmail.com") {
      return res.status(400).json({ message: "Invalid email format" });
    }


    const existingEmail = await userModel.findOne({ email: email });

    if (existingEmail) {
      res.status(status.BAD_REQUEST).json({ message: "User already register with this mail try another mail" });
      return;
    }


    // await client.del(OTPKey);
    const otp = generateOTP();





    console.log("Generated OTP ", otp);


    const existingOtp = await otpModel.findOne({ userMail: email });

    if (existingOtp) {
      await otpModel.deleteOne({ userMail: email });
    }

    const newOtp = new otpModel({
      userMail: email,
      otp: otp,
    });

    await newOtp.save();


    await addMessageToQueue(email, otp);





    console.log("Email sent");

    return res.status(200).json({ message: "Check your Email for OTP", email: email });


  } catch (error) {

    res.status(500).json({ message: "Internal Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  console.log(otp)
  try {

    const verifyOTP = await otpModel.findOne({ userMail: email, otp: otp });

    if (!verifyOTP) {

      return res.status(400).json({ message: "OTP expired request a new one" });
    }

    if (otp === verifyOTP.otp) {
      await otpModel.deleteOne({ userMail: email, otp: otp });
      return res.status(200).json({ message: "OTP verified successfully", email: email });
    } else {
      return res.status(404).json({ message: "Wrong OTP entered" });
    }

  } catch (e) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: `${e}` });
  }
};



export const register = async (req, res) => {
  const { fullname, password, email } = req.body;

  console.log(email);


  try {
    const existingUser = await userModel.findOne({ email: email });

    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "UserName already exists" });

    }
    const salt = Number(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName: fullname,
      password: hashedPassword,
      email: email,
      joinDate: new Date(Date.now()),
    });

    await newUser.save();


    res
      .status(status.CREATED)
      .json({ message: "User registered successfully" });
  } catch (e) {

    console.log(e);
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: `${e}` });
  }
};

export const login = async (req, res) => {
  // await userModel.deleteMany({});
  // await appointmentModel.deleteMany({});
  // await slotModel.deleteMany({});
  // console.log("Cleared");
  // return res.json("Working");
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    const user = await userModel.findOne({ email: email });

    console.log(user);

    if (!user) {
      res
        .status(status.BAD_REQUEST)
        .json({ message: "Username or password is incorrect" });
      return;
    }

    if (!user.activeStatus) {
      return res.status(status.BAD_REQUEST).json({ message: "User is DEACTIVATED by admin" });
    }

    const ispasswordMatched = await bcrypt.compare(password, user.password);

    if (ispasswordMatched) {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        algorithm: "HS512",
        expiresIn: "1h",
      });

      //  console.log(token);
      const isProduction = process.env.NODE_ENV === "production";

      console.log('NODE_ENV here:', process.env.NODE_ENV);
      console.log('isProduction here :', isProduction);
      console.log('FRONTEND_URL here :', process.env.FRONTEND_URL);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "lax",
        path: "/",
      });
      res
        .status(status.OK)
        .json({ message: "User logged in successfully", id: nanoid() });
    } else {
      res
        .status(status.BAD_REQUEST)
        .json({ message: "Username or password is incorrect" });
    }
  } catch (e) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: `${e}` });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });

  } catch (e) {
    return res.status(500).json({
      message: "Internal server error occurred",
    });
  }
};



export const userInfo = async (req, res) => {
  const { userId } = req.user;
  console.log("request received");

  try {






    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: "No user found" });
    }


    console.log(user);
    console.log("DB data user info sent");

    const userObj = { fullName: user.fullName, email: user.email };


    // console.log("Db data sent");
    res.status(status.OK).json({ userInfo: userObj });
  } catch (e) {
    res.status(500).json({ message: "Cannot find  user details" });
  }
};



// export const test = async (req, res) => {
//   const user = await userModel.find({ username: "aadil_user" });
//   res.status(200).json(user);
// };






