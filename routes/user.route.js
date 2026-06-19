import { Router } from "express";
import { register,login,logout, userInfo,sendOTP,verifyOTP, googleAuthentication } from "../controllers/user.controller.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const userRoutes=Router();

userRoutes.route("/auth/google").get(googleAuthentication);
userRoutes.route("/sendOTP").post(sendOTP);
userRoutes.route("/verifyOTP").post(verifyOTP);
userRoutes.route("/register").post(register);
userRoutes.route("/login").post(login);
userRoutes.route("/logout").post(authMiddleware,logout);
userRoutes.route("/userInfo").get(authMiddleware,userInfo);