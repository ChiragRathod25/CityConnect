import {Resend} from "resend";
import twilio from "twilio";
import { ApiError } from "./ApiError.js";
import "dotenv/config.js";


const resend=new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendEmailVerification =async({email,verificationCode})=>{
    // const verificationLink=`${process.env.FRONTEND_URL}/verify-email?code=${verificationCode}&email=${email}`;
    let response;
    try {
        response = await resend.emails.send({
            // from: process.env.RESEND_FROM_EMAIL,
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email address",
            html: `<p>Your verification code is: ${verificationCode}</p>`
        });
       
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new ApiError(500,"Error sending verification email");
      
    }
    return response;
}

const sendMobileVerification =async({phoneNumber,verificationCode})=>{
    try {
    const message = await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
      to: phoneNumber,
    });

    return message;
  } catch (err) {
    console.error("Twilio SMS error:", err);
    throw new Error("Failed to send verification SMS");
  }
}

export {sendEmailVerification, sendMobileVerification};