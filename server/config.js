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
  smtpUser: required('SMTP_USER'),
  smtpPassword: required('SMTP_PASSWORD'),
  emailFrom: process.env.EMAIL_FROM || `30Days Game UI <${process.env.SMTP_USER}>`,
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
  cronSecret: required('CRON_SECRET')
};
