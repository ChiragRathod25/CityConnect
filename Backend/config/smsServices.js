const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (phone, otp, purpose) => {
  await client.messages.create({
    body: `Your verification code is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};

export default { sendOTP };