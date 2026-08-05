import { config } from './config.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function parseFrom(value) {
  const match = /^(.*)\s*<([^>]+)>$/.exec(value);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { email: value.trim() };
}

export async function sendEmail({ to, subject, html }) {
  const sender = parseFrom(config.emailFrom);

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.brevoApiKey
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${body}`);
  }

  return response.json();
}
