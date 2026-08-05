import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: process.env.PORT || 3000,
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  gmailUser: required('GMAIL_USER'),
  gmailAppPassword: required('GMAIL_APP_PASSWORD'),
  emailFrom: process.env.EMAIL_FROM || `30Days Game UI <${process.env.GMAIL_USER}>`,
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
  cronSecret: required('CRON_SECRET')
};
