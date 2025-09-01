import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp, purpose) => {
  const subject = {
    'registration': 'Verify Your Email',
    '2fa': 'Two-Factor Authentication',
    'password_reset': 'Password Reset Code'
  };

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: subject[purpose],
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`
  });
};

export default { sendOTP };