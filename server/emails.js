import { TOTAL_DAYS } from './challenges.js';

export function confirmEmailHtml({ email, confirmUrl, brand }) {
  return `
  <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#0d0d0d;color:#f5f5f5;border:1px solid #262626;border-radius:12px;overflow:hidden">
    <div style="padding:20px 28px;border-bottom:1px solid #262626;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a">
      ${brand} &middot; Confirm your email
    </div>
    <div style="padding:32px 28px">
      <h1 style="font-size:24px;margin:0 0 12px">You're almost in! 🎮</h1>
      <p style="color:#bdb8d6;font-size:15px;line-height:1.6;margin:0 0 24px">
        One last step. Confirm your email (<strong style="color:#f5f5f5">${email}</strong>) to start receiving your first
        game UI challenge tomorrow at 8:00 AM. You'll get 1 challenge every day for ${TOTAL_DAYS} days.
      </p>
      <a href="${confirmUrl}" style="display:inline-block;background:#ffffff;color:#0a0a0a;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:8px;font-size:15px">Confirm my email</a>
      <p style="color:#555;font-size:12px;margin-top:20px">If you didn't subscribe, ignore this email.</p>
    </div>
  </div>
  `;
}

export function challengeEmailHtml({ day, title, game, tips, hasReference, referenceUrl, shareTag, unsubscribeUrl, brand, publicUrl }) {
  const imageBlock = hasReference
    ? `
      <div style="border:1px solid #262626;border-radius:10px;overflow:hidden;margin-bottom:24px">
        <img src="${referenceUrl}" alt="${title} reference" style="width:100%;display:block">
        <div style="padding:10px 16px;font-size:12px;color:#8a8a8a;background:#111">Reference image &middot; ${game}</div>
      </div>`
    : '';

  const tipsHtml = tips.map((t) => `<li style="margin-bottom:6px">${t}</li>`).join('');

  return `
  <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#0d0d0d;color:#f5f5f5;border:1px solid #262626;border-radius:12px;overflow:hidden">
    <div style="padding:20px 28px;border-bottom:1px solid #262626;display:flex;justify-content:space-between;font-size:12px;letter-spacing:1px;text-transform:uppercase">
      <span style="color:#f5f5f5;font-weight:bold">Day ${day} of ${TOTAL_DAYS}</span>
      <span style="color:#8a8a8a">${brand}</span>
    </div>
    <div style="padding:32px 28px">
      <h1 style="font-size:26px;margin:0 0 6px">${title}</h1>
      <p style="color:#8a8a8a;font-size:14px;margin:0 0 24px">
        ${game}
      </p>
      ${imageBlock}
      <p style="font-size:14px;color:#bdb8d6;line-height:1.6;margin:0 0 16px">
        ${tips.length ? 'Design tips for today:' : ''}
      </p>
      <ul style="color:#bdb8d6;font-size:14px;line-height:1.6;padding-left:20px;margin:0 0 28px">
        ${tipsHtml}
      </ul>
      <div style="border:1px solid #262626;border-radius:8px;padding:14px 18px;font-size:14px;color:#8a8a8a;text-align:center;margin-bottom:24px">
        Share your design with <strong style="color:#f5f5f5">${shareTag}</strong>
      </div>
      <p style="color:#555;font-size:12px;margin:0">
        Not enjoying it? <a href="${unsubscribeUrl}" style="color:#8a8a8a">Unsubscribe</a>.
      </p>
    </div>
  </div>
  `;
}
