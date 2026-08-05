import nodemailer from 'nodemailer';
import { config } from './config.js';

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword
  }
});

export async function sendEmail({ to, subject, html }) {
  return transport.sendMail({
    from: config.emailFrom,
    to,
    subject,
    html
  });
}
