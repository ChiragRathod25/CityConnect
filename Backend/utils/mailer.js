import nodemailer from "nodemailer";
import  {ApiError}  from "./ApiError.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_SENDER_EMAIL,
    pass: process.env.SMTP_EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  if ([to, subject].some((field) => (field?.trim() ?? "") === ""))
    throw new ApiError(404, `from, to and subject is required for the email`);

  if (!html && !text) {
    throw new ApiError(404, `text or html is required for the email`);
  }
  const mailDetails = {
    from: "CityConnect " + process.env.SMTP_SENDER_EMAIL,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  try {
    const response = await transporter.sendMail(mailDetails);
    
    return response;
  } catch (error) {
    throw new ApiError(400, "Error while sending an email", error);
  }
};