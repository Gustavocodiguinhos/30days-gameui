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
  brevoApiKey: required('BREVO_API_KEY'),
  emailFrom: process.env.EMAIL_FROM || '30Days Game UI <onboarding@resend.dev>',
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
  cronSecret: required('CRON_SECRET')
};
