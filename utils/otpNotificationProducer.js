// import amqp from "amqplib";
import { sendMail } from "./mailHelper.js";



export const addMessageToQueue = async (email, otp) => {

  try {


    const message = {

      msg: msg(otp),
      subject: "Verification code",
      email: email,
    }


    await sendMail(message);




  } catch (error) {
    console.log(error);
  }



}


export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const msg = (otp) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
    <style>
      /* Base styles */
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f4f6f8;
        padding: 20px 0;
      }

      .main {
        background-color: #ffffff;
        border-radius: 12px;
        max-width: 500px;
        margin: 0 auto;
        padding: 30px 25px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      h2 {
        color: #2563eb;
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 22px;
      }

      p {
        color: #444;
        font-size: 15px;
        line-height: 1.6;
        margin: 8px 0;
      }

      .otp-box {
        display: inline-block;
        background-color: #eef3ff;
        color: #1e3a8a;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 3px;
        border-radius: 10px;
        padding: 12px 28px;
        margin: 20px 0;
      }

      .footer {
        color: #888;
        font-size: 12px;
        margin-top: 25px;
        border-top: 1px solid #eee;
        padding-top: 15px;
      }

      /* Mobile styles */
      @media only screen and (max-width: 600px) {
        .main {
          width: 90% !important;
          padding: 20px 15px !important;
        }

        h2 {
          font-size: 20px !important;
        }

        .otp-box {
          font-size: 22px !important;
          padding: 10px 20px !important;
        }

        p {
          font-size: 14px !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="main">
        <h2>🔐 Verification Code</h2>
        <p>Your verification code is:</p>
        <div class="otp-box">${otp}</div>
        <p>This code is valid for <strong>5 minutes</strong>.</p>
        <p>Please <strong>do not share</strong> this code with anyone for security reasons.</p>

        <div class="footer">
          If you didn’t request this code, you can safely ignore this email.<br />
          Team MKHospital
        </div>
      </div>
    </div>
  </body>
</html>
`;


