import {google} from "googleapis";
import dotenv from "dotenv"
dotenv.config();


const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET;

console.log("Google OAuth ENV:", {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
});


export const Oauth2Client=new google.auth.OAuth2(GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,`postmessage`);