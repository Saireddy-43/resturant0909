import express, { Request, Response } from 'express';
import { sendOTP, generateOTP } from './emailService';

const router = express.Router();
const otpStore = new Map<string, { otp: string; timestamp: number }>();

router.post('/api/send-otp', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = generateOTP();
  const success = await sendOTP(email, otp);

  if (success) {
    // Store OTP with timestamp (expires in 10 minutes)
    otpStore.set(email, { otp, timestamp: Date.now() + 10 * 60 * 1000 });
    res.json({ message: 'OTP sent successfully' });
  } else {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

router.post('/api/verify-otp', (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ message: 'No OTP found for this email' });
  }

  if (Date.now() > storedData.timestamp) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP verified successfully
  otpStore.delete(email);
  res.json({ message: 'OTP verified successfully' });
});

export default router; 