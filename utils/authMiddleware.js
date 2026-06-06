import jwt from "jsonwebtoken";
// import { client } from "../RedisCache/client.js";
import { userModel } from "../models/user.model.js";


export const authMiddleware = (req, res, next) => {
  // console.log("Cookies received:", req.cookies); 
  // To get your token:
  const token = req.cookies.jwt;
  //console.log("jwt:", token);
  //console.log(req.path);


  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Session timed out" });
    }
    //console.log(user);

    console.log(user);

    const blackListedUser = await userModel.findById(user.userId);

    const isUserActive = blackListedUser?.activeStatus
    if (!isUserActive) {
      const isProduction = process.env.NODE_ENV === "production";
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });

      return res.status(401).json({ message: "User is DEACTIVATED by admin" });
    }
    req.user = user;
    next();
  });


};



