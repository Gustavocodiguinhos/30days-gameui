import nodemailer from 'nodemailer';
import dns from 'node:dns';
import { config } from './config.js';

dns.setDefaultResultOrder('ipv4first');

const transport = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword
  },
  connectionTimeout: 30000,
  socketTimeout: 30000
});

export async function sendEmail({ to, subject, html }) {
  return transport.sendMail({
    from: config.emailFrom,
    to,
    subject,
    html
  });
}
