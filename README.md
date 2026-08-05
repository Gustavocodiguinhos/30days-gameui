# 30Days Game UI

A daily game UI challenge sent to your inbox at 8:00 AM for 30 days. 24 challenges ask you to recreate a famous game UI (with a reference image); 6 challenge you to design a fictional idea from scratch.

## Stack

- **Backend**: Node.js + Express
- **Database**: Supabase (Postgres)
- **Emails**: Resend
- **Frontend**: static HTML/CSS/JS in `public/`
- **Scheduling**: GitHub Actions cron → `POST /api/cron`

## Local development

```bash
npm install
cp .env.example .env   # fill in real values
npm run dev
```

## Environment variables

See `.env.example`. Required: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET`. Optional: `EMAIL_FROM`, `PUBLIC_URL`, `PORT`.

## Deployment

Deploy with the Render blueprint in `render.yaml` (web service, `npm install` + `node server/index.js`). Set the env vars in the Render dashboard. The GitHub Actions workflow calls `/api/cron` daily at 11:00 UTC (08:00 São Paulo) using the `PUBLIC_URL` and `CRON_SECRET` repository secrets.

## Admin

`/admin.html` — protected by `CRON_SECRET`. Manage the 30 challenges and upload reference images.

## Database

`schema.sql` defines the `subscribers` and `challenges` tables. Run it once in Supabase SQL editor. The server seeds the challenges table on first boot if it is empty.
