// Contact / quote / resource / application submissions -> Resend email API
// Requires env vars on Vercel: RESEND_API_KEY, optionally CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP
const MAX_BODY_BYTES = 4 * 1024 * 1024;

function checkRateLimit(ip) {
  const now = Date.now();

  // Prune stale entries so the map stays bounded
  if (rateLimitMap.size > 500) {
    for (const [key, record] of rateLimitMap) {
      if (now - record.start > RATE_LIMIT_WINDOW) rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);

  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .slice(0, 4000)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

function getClientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         'unknown';
}

const ALLOWED_ORIGINS = [
  'https://walnutmedical.in',
  'https://www.walnutmedical.in',
  'http://localhost:3000',
  'http://localhost:5173',
];

const ALLOWED_TYPES = ['contact', 'quote', 'resource', 'application'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  phone: 20,
  company: 100,
  subject: 200,
  message: 2000,
  quantity: 50,
  resourceTitle: 200,
  jobTitle: 200,
};

async function sendViaResend({ subject, text, replyTo, attachment }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const err = new Error('Email service is not configured');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const payload = {
    from: process.env.CONTACT_FROM_EMAIL || 'Walnut Technologies <onboarding@resend.dev>',
    to: [process.env.CONTACT_TO_EMAIL || 'contact@walnutmedical.in'],
    reply_to: replyTo,
    subject,
    text,
  };

  if (attachment) {
    payload.attachments = [{ filename: attachment.filename, content: attachment.content }];
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('Resend error:', response.status, detail.slice(0, 300));
    const err = new Error('Email provider rejected the message');
    err.code = 'PROVIDER_ERROR';
    throw err;
  }

  return true;
}

export default async function handler(req, res) {
  try {
    const origin = req.headers.origin || '';

    // CORS - allow listed origins only; reject others
    const originAllowed = !origin || ALLOWED_ORIGINS.includes(origin);
    if (originAllowed && origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!originAllowed) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Unsupported content type' });
    }

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    if (JSON.stringify(req.body).length > MAX_BODY_BYTES) {
      return res.status(413).json({ error: 'Request too large' });
    }

    const clientIp = getClientIp(req);
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const {
      name, email, phone, company, subject, message, type,
      website, formTime, quantity, resourceTitle, jobTitle, resume,
    } = req.body;

    // Honeypot - bots fill this, humans don't
    if (website) {
      return res.status(200).json({ success: true, message: 'Form submitted successfully.' });
    }

    const submissionType = ALLOWED_TYPES.includes(type) ? type : 'contact';

    // Timing check - reject submissions that are too fast (< 3s) or too stale (> 1h).
    // Non-numeric timestamps are rejected too (previously NaN silently passed).
    if (formTime !== undefined && formTime !== '') {
      const started = Number(formTime);
      if (!Number.isFinite(started)) {
        return res.status(400).json({ error: 'Form submission failed. Please try again.' });
      }
      const elapsed = Date.now() - started;
      if (elapsed < 3000 || elapsed > 3600000) {
        return res.status(400).json({ error: 'Form submission failed. Please try again.' });
      }
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (submissionType === 'application') {
      if (!message && !jobTitle) {
        return res.status(400).json({ error: 'Please complete the application fields' });
      }
    } else if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    for (const [field, maxLen] of Object.entries(MAX_LENGTHS)) {
      const value = req.body[field];
      if (value !== undefined && value !== null && String(value).length > maxLen) {
        return res.status(400).json({ error: `${field} exceeds maximum length of ${maxLen}` });
      }
    }

    // Optional resume attachment (application type only)
    let attachment = null;
    if (resume && typeof resume === 'object') {
      const { filename, contentType: resumeType, content } = resume;
      if (typeof content === 'string' && content.length > 0) {
        if (content.length > 3 * 1024 * 1024) {
          return res.status(413).json({ error: 'Resume file is too large. Please keep it under 3MB.' });
        }
        if (!/^[A-Za-z0-9+/=\s]+$/.test(content.slice(0, 1000))) {
          return res.status(400).json({ error: 'Invalid resume file data' });
        }
        attachment = {
          filename: String(filename || 'resume').replace(/[^\w.\- ]/g, '_').slice(0, 120),
          content,
        };
        if (resumeType) void resumeType;
      }
    }

    const sanitized = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone || ''),
      company: sanitizeInput(company || ''),
      subject: sanitizeInput(subject || ''),
      message: sanitizeInput(message || ''),
      quantity: sanitizeInput(quantity || ''),
      resourceTitle: sanitizeInput(resourceTitle || ''),
      jobTitle: sanitizeInput(jobTitle || ''),
    };

    let emailSubject;
    const lines = [
      `Name: ${sanitized.name}`,
      `Email: ${sanitized.email}`,
      `Phone: ${sanitized.phone || 'Not provided'}`,
      `Company: ${sanitized.company || 'Not provided'}`,
    ];

    if (submissionType === 'quote') {
      emailSubject = `New Quote Request - ${sanitized.subject || 'General'}`;
      lines.push(`Product: ${sanitized.subject || 'Not specified'}`);
      lines.push(`Quantity: ${sanitized.quantity || 'Not specified'}`);
    } else if (submissionType === 'resource') {
      emailSubject = `Resource Request - ${sanitized.resourceTitle || 'Website resource'}`;
      lines.push(`Resource: ${sanitized.resourceTitle || 'Not specified'}`);
    } else if (submissionType === 'application') {
      emailSubject = `Job Application - ${sanitized.jobTitle || 'Open role'}`;
      lines.push(`Role: ${sanitized.jobTitle || 'Not specified'}`);
    } else {
      emailSubject = sanitized.subject || 'New Contact Message';
      if (sanitized.subject) lines.push(`Subject: ${sanitized.subject}`);
    }

    lines.push(`Message: ${sanitized.message || '-'}`);
    lines.push('');
    lines.push(`Submitted: ${new Date().toISOString()} from IP ${clientIp}`);

    await sendViaResend({
      subject: emailSubject,
      text: lines.join('\n'),
      replyTo: sanitized.email,
      attachment,
    });

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully. We will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact handler error:', error);
    if (error && error.code === 'NOT_CONFIGURED') {
      return res.status(503).json({
        error: 'Sending is temporarily unavailable. Please email us directly at contact@walnutmedical.in.',
      });
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again or email us at contact@walnutmedical.in.' });
  }
}
