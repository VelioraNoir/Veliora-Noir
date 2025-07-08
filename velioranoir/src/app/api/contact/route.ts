import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, subject, message, inquiryType, phone } = await req.json();

  // Configure your SMTP transporter (e.g. via ENV vars)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Build the email
  await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: 'help.velioranoir@gmail.com',
    subject: subject || `${inquiryType} inquiry`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Type: ${inquiryType}

Message:
${message}
    `.trim()
  });

  return NextResponse.json({ success: true });
}
 