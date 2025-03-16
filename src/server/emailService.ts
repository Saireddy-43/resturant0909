import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'surendrareddy49175@gmail.com',
    pass: process.env.EMAIL_PASSWORD // You'll need to set this in your environment variables
  }
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: 'surendrareddy49175@gmail.com',
    to: email,
    subject: 'Your OTP for Registration',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Spice Symphony!</h2>
        <p>Your OTP for registration is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Function to generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 