import { config } from '../config.js';

// Sends via Resend; without an API key (local dev) the email is printed instead.
// Returns true only when the email was actually delivered. Never throws: a mail
// provider outage or an unverified sender must not block the invite/reset flow —
// the caller gets the link back and can pass it on manually.
export async function sendMail({ to, subject, text }) {
  if (!config.resendApiKey) {
    console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n${text}\n`);
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: config.mailFrom, to: [to], subject, text }),
    });
    if (res.ok) return true;
    const detail = await res.text().catch(() => '');
    console.warn(`[mail] Resend rejected email to ${to} (${res.status}): ${detail.slice(0, 300)}`);
  } catch (err) {
    console.warn(`[mail] could not reach Resend for ${to}: ${err.message}`);
  }
  return false;
}

export function inviteEmail({ name, inviterName, link }) {
  return {
    subject: 'You have been invited to the Walnut Technologies admin panel',
    text: [
      `Hi ${name},`,
      '',
      `${inviterName} has invited you to the Walnut Technologies admin panel.`,
      'Set your password using the link below (valid for 72 hours):',
      '',
      link,
      '',
      'If you were not expecting this, you can ignore this email.',
    ].join('\n'),
  };
}

export function resetEmail({ name, link }) {
  return {
    subject: 'Reset your Walnut admin password',
    text: [
      `Hi ${name},`,
      '',
      'Someone requested a password reset for your Walnut admin account.',
      'Use the link below within 30 minutes:',
      '',
      link,
      '',
      'If this was not you, ignore this email — your password stays unchanged.',
    ].join('\n'),
  };
}
