// import amqp from "amqplib"

import { sendMail } from "./mailHelper.js";





export const userDeactivationMail = async (user) => {

  try {





    // console.log(appointmentdate);
    //  console.log(bookingDate);
    const body = userIDInvalidationMessage(user.fullName, user.email, user.joinDate, user.activeStatus);

    const message = {
      email: user.email,
      msg: body,
      subject: "User deactivation notification",
    }





    await sendMail(message);






  } catch (error) {
    console.log(error);
  }
}





const userIDInvalidationMessage = (
  fullName,
  email,
  joinDate,
  activeStatus
) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Account Deactivation</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 10px !important;
        }
        .content {
          padding: 16px !important;
        }
        table {
          font-size: 14px !important;
        }
        h2 {
          font-size: 20px !important;
        }
      }
    </style>
  </head>

  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fb; margin: 0; padding: 0;">
    <div class="container" style="max-width: 600px; background-color: #ffffff; margin: 20px auto; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
      
      <div style="background-color: #dc3545; padding: 16px; color: #ffffff; text-align: center;">
        <h2 style="margin: 0;">MK Hospital, Jhansi</h2>
        <p style="margin: 4px 0;">Account Deactivation Notice</p>
      </div>

      <div class="content" style="padding: 24px; color: #333333;">
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>We regret to inform you that your user account has been <strong>deactivated</strong> by the MK Hospital Administration due to policy or compliance reasons.</p>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #dc3545; margin-bottom: 10px;">Account Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">🧍 <strong>Full Name</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">📧 <strong>Email</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">📅 <strong>Joined On</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${joinDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">🔒 <strong>Account Status</strong></td>
              <td style="padding: 8px; color: ${activeStatus ? '#28a745' : '#dc3545'}; font-weight: bold;">
                ${activeStatus ? 'Active' : 'Deactivated'}
              </td>
            </tr>
          </table>
        </div>

        <p style="margin-top: 20px;">If you believe this action was made in error, please reach out to our administrative team for review. During this period, you will not be able to book appointments or access your dashboard.</p>

        <p style="margin-top: 20px;">You can contact us at the email address below for reactivation requests or more details.</p>

        <p style="margin-top: 20px; font-size: 14px; color: #555;">Thank you for your cooperation and understanding.<br>
        <strong>Team MK Hospital Jhansi</strong><br>
        📧 support@mkhopedialysisunit@gmail.com</p>
      </div>
    </div>
  </body>
  </html>
`;
