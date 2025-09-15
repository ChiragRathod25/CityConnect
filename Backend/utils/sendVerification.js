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

// 3. Fix phone number format for Twilio
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
    
  if (cleaned.length === 10) {
    cleaned = '+91' + cleaned;
  } 
  else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    cleaned = '+' + cleaned;
  }
  else if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  else if (cleaned.length > 10) {
    cleaned = '+' + cleaned;
  } else {
    cleaned = '+91' + cleaned;
  }  
  return cleaned;
};

const sendMobileVerification =async({phoneNumber,verificationCode})=>{
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: formattedPhone,
    });

    return message;
  } catch (err) {
    console.error("Twilio SMS error:", err);
    throw new Error("Failed to send verification SMS");
  }
}

export {sendEmailVerification, sendMobileVerification};