import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';
import { config } from './config.js';
import { sendEmail } from './mailer.js';
import {
  findSubscriberByEmail,
  upsertSubscriber,
  confirmSubscriber,
  unsubscribeSubscriber,
  listConfirmedSubscribers,
  updateLastSentDay,
  listChallenges,
  getChallengeByDay,
  challengeCount,
  seedChallenges,
  updateChallenge,
  createChallenge,
  deleteChallenge
} from './db.js';
import { TOTAL_DAYS, challenges as seedChallengesData } from './challenges.js';
import { confirmEmailHtml, challengeEmailHtml } from './emails.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const referencesDir = path.join(publicDir, 'references');

const app = express();

const upload = multer({
  storage: multer.diskStorage({
    destination: referencesDir,
    filename: (req, file, cb) => {
      const day = String(req.body.day || '').padStart(2, '0');
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `day-${day}${ext}`);
    }
  })
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHARE_TAG = '#30daysgameui';

function token() {
  return crypto.randomBytes(32).toString('hex');
}

function emailError(message) {
  return { error: message };
}

function isAdmin(req, res) {
  if (req.headers['x-cron-secret'] !== config.cronSecret) {
    res.status(401).json(emailError('Unauthorized.'));
    return false;
  }
  return true;
}

app.use(express.json());
app.use('/references', express.static(path.join(publicDir, 'references'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store');
  }
}));
app.use(express.static(publicDir));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/subscribe', async (req, res) => {
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json(emailError('A valid email is required.'));
  }

  try {
    const existing = await findSubscriberByEmail(email);
    if (existing && existing.unsubscribed) {
      return res.status(400).json(emailError('This email was unsubscribed.'));
    }

    const confirmToken = token();
    const unsubscribeToken = token();
    const subscriber = await upsertSubscriber({
      email,
      confirmed: existing ? existing.confirmed : false,
      confirm_token: existing ? existing.confirm_token : confirmToken,
      unsubscribe_token: existing ? existing.unsubscribe_token : unsubscribeToken,
      last_sent_day: existing ? existing.last_sent_day : 0,
      start_date: existing ? existing.start_date : null
    });

    if (subscriber.confirmed) {
      return res.json({ ok: true, message: 'already subscribed' });
    }

    const confirmUrl = `${config.publicUrl}/api/confirm?token=${subscriber.confirm_token}`;
    try {
      await sendEmail({
        to: email,
        subject: 'Confirm your subscription — 30Days Game UI',
        html: confirmEmailHtml({ email, confirmUrl, brand: '30Days Game UI' })
      });
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
      return res.status(500).json(emailError('Failed to send confirmation email.'));
    }

    res.json({ ok: true, message: 'confirmation sent' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json(emailError('Something went wrong.'));
  }
});

app.get('/api/confirm', async (req, res) => {
  const token = String(req.query.token || '');
  if (!token) return res.status(400).send('Missing token.');

  try {
    const subscriber = await confirmSubscriber(token);
    if (!subscriber) return res.status(404).send('Invalid or expired confirmation link.');
    res.redirect('/?subscribed=1');
  } catch (err) {
    console.error('Confirm error:', err);
    res.status(500).send('Something went wrong.');
  }
});

app.get('/api/unsubscribe', async (req, res) => {
  const token = String(req.query.token || '');
  if (!token) return res.status(400).send('Missing token.');

  try {
    const subscriber = await unsubscribeSubscriber(token);
    if (!subscriber) return res.status(404).send('Invalid unsubscribe link.');
    res.send('You have been unsubscribed. Goodbye and good luck!');
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).send('Something went wrong.');
  }
});

function todayDayNumber(startDate) {
  const start = new Date(startDate + 'T00:00:00');
  const today = new Date();
  const ms = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  return Math.floor(ms / 86400000) + 1;
}

function referenceExists(reference) {
  if (!reference) return false;
  const filePath = path.join(publicDir, reference);
  return fs.existsSync(filePath);
}

async function sendDailyChallenges() {
  const subscribers = await listConfirmedSubscribers();
  const results = { attempted: 0, sent: 0, skipped: 0, failed: [] };

  for (const sub of subscribers) {
    const day = todayDayNumber(sub.start_date);
    if (day < 1 || day > TOTAL_DAYS) continue;
    if (day <= sub.last_sent_day) {
      results.skipped += 1;
      continue;
    }

    const challenge = await getChallengeByDay(day);
    if (!challenge) continue;

    results.attempted += 1;
    const hasReference = challenge.type === 'recreate' && referenceExists(challenge.reference);
    const html = challengeEmailHtml({
      day,
      title: challenge.title,
      game: challenge.game,
      tips: challenge.tips,
      hasReference,
      referenceUrl: `${config.publicUrl}${challenge.reference}`,
      shareTag: SHARE_TAG,
      unsubscribeUrl: `${config.publicUrl}/api/unsubscribe?token=${sub.unsubscribe_token}`,
      brand: '30Days Game UI',
      publicUrl: config.publicUrl
    });

    try {
      await sendEmail({
        to: sub.email,
        subject: `Day ${day}: ${challenge.title} — 30Days Game UI`,
        html
      });
    } catch (err) {
      console.error(`Failed to send day ${day} to ${sub.email}:`, err);
      results.failed.push(sub.email);
      continue;
    }

    await updateLastSentDay(sub.id, day);
    results.sent += 1;
  }

  return results;
}

app.post('/api/cron', async (req, res) => {
  if (req.headers['x-cron-secret'] !== config.cronSecret) {
    return res.status(401).json(emailError('Unauthorized.'));
  }

  try {
    const results = await sendDailyChallenges();
    res.json({ ok: true, ...results });
  } catch (err) {
    console.error('Cron error:', err);
    res.status(500).json(emailError('Cron failed.'));
  }
});

app.get('/api/challenges', async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const challenges = await listChallenges();
    res.json({ total: challenges.length, challenges });
  } catch (err) {
    console.error('List challenges error:', err);
    res.status(500).json(emailError('Failed to load challenges.'));
  }
});

function parseChallengeBody(body) {
  const day = parseInt(body.day, 10);
  const title = String(body.title || '').trim();
  const game = String(body.game || '').trim();
  const type = body.type === 'scratch' ? 'scratch' : 'recreate';
  let reference = body.reference ? String(body.reference).trim() : null;
  if (reference && !reference.startsWith('/')) reference = '/' + reference;
  const tips = String(body.tips || '')
    .split(/\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean);
  return { day, title, game, type, reference, tips };
}

app.post('/api/challenges', async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const challenge = parseChallengeBody(req.body);
    if (!challenge.day || !challenge.title) {
      return res.status(400).json(emailError('Day and title are required.'));
    }
    const created = await createChallenge(challenge);
    res.json({ ok: true, challenge: created });
  } catch (err) {
    console.error('Create challenge error:', err);
    res.status(500).json(emailError('Failed to create challenge.'));
  }
});

app.patch('/api/challenges/:day', async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const day = parseInt(req.params.day, 10);
    const challenge = parseChallengeBody(req.body);
    if (!challenge.title) {
      return res.status(400).json(emailError('Title is required.'));
    }
    const updated = await updateChallenge(day, challenge);
    res.json({ ok: true, challenge: updated });
  } catch (err) {
    console.error('Update challenge error:', err);
    res.status(500).json(emailError('Failed to update challenge.'));
  }
});

app.delete('/api/challenges/:day', async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const day = parseInt(req.params.day, 10);
    await deleteChallenge(day);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete challenge error:', err);
    res.status(500).json(emailError('Failed to delete challenge.'));
  }
});

function adminGuard(req, res, next) {
  if (!isAdmin(req, res)) return;
  next();
}

app.post('/api/references', adminGuard, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json(emailError('No image uploaded.'));
    const day = String(req.body.day || '').padStart(2, '0');
    const ext = path.extname(req.file.filename);
    const reference = `/references/day-${day}${ext}`;
    if (req.body.day) {
      await updateChallenge(parseInt(req.body.day, 10), { reference });
    }
    res.json({ ok: true, reference });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json(emailError('Failed to upload image.'));
  }
});

app.get('/api/subscribers', async (req, res) => {
  if (req.headers['x-cron-secret'] !== config.cronSecret) {
    return res.status(401).json(emailError('Unauthorized.'));
  }

  try {
    const subscribers = await listConfirmedSubscribers();
    res.json({
      total: subscribers.length,
      emails: subscribers.map((s) => ({ email: s.email, start_date: s.start_date, last_sent_day: s.last_sent_day }))
    });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json(emailError('Failed to list subscribers.'));
  }
});

async function start() {
  if (!fs.existsSync(referencesDir)) {
    fs.mkdirSync(referencesDir, { recursive: true });
  }

  try {
    if ((await challengeCount()) === 0) {
      await seedChallenges(seedChallengesData);
      console.log('Seeded challenges table with 30 challenges.');
    }
  } catch (err) {
    console.error('Challenge seeding skipped:', err.message);
  }

  app.listen(config.port, () => {
    console.log(`30Days Game UI server running on http://localhost:${config.port}`);
  });
}

start();
