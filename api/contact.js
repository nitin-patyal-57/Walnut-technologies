// Simple in-memory rate limiter (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
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
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         'unknown';
}

const ALLOWED_ORIGINS = [
  'https://walnutmedical.in',
  'https://www.walnutmedical.in',
  'http://localhost:3000',
  'http://localhost:5173',
];

export default async function handler(req, res) {
  // Get client origin
  const origin = req.headers.origin || '';
  
  // CORS - restrict to allowed origins
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, phone, company, subject, message, type, website, formTime } = req.body;

  // Honeypot check - bots fill this, humans don't
  if (website) {
    return res.status(200).json({ success: true, message: 'Form submitted successfully.' });
  }

  // Timestamp check - reject forms submitted too fast (< 3 seconds) or too slow (> 1 hour)
  if (formTime) {
    const elapsed = Date.now() - parseInt(formTime, 10);
    if (elapsed < 3000 || elapsed > 3600000) {
      return res.status(400).json({ error: 'Form submission failed. Please try again.' });
    }
  }

  // Validation - required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Input length validation
  const MAX_LENGTHS = { name: 100, email: 254, phone: 20, company: 100, subject: 200, message: 2000 };
  for (const [field, maxLen] of Object.entries(MAX_LENGTHS)) {
    if (req.body[field] && req.body[field].length > maxLen) {
      return res.status(400).json({ error: `${field} exceeds maximum length of ${maxLen}` });
    }
  }

  // Sanitize inputs
  const sanitized = {
    name: sanitizeInput(name),
    email: sanitizeInput(email),
    phone: sanitizeInput(phone || ''),
    company: sanitizeInput(company || ''),
    subject: sanitizeInput(subject || ''),
    message: sanitizeInput(message),
  };

  // Format email content (safe - no user input interpolated directly)
  const emailSubject = type === 'quote' 
    ? `New Quote Request - ${sanitized.subject || 'General'}`
    : sanitized.subject || 'New Contact Message';

  const emailBody = [
    `Name: ${sanitized.name}`,
    `Email: ${sanitized.email}`,
    `Phone: ${sanitized.phone || 'Not provided'}`,
    `Company: ${sanitized.company || 'Not provided'}`,
    type === 'quote' 
      ? `Product: ${sanitized.subject || 'Not specified'}\nQuantity: ${req.body.quantity || 'Not specified'}`
      : `Subject: ${sanitized.subject || 'Not specified'}`,
    `Message: ${sanitized.message}`,
  ].join('\n');

  // Log submission (server-side only)
  console.log(`[${new Date().toISOString()}] Form submission from ${clientIp}:`, {
    type,
    emailSubject,
  });

  // TODO: Integrate with email service (SendGrid, Resend, etc.)
  // Example with Resend:
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@walnutmedical.in',
  //   to: 'contact@walnutmedical.in',
  //   subject: emailSubject,
  //   text: emailBody,
  // });

  return res.status(200).json({ 
    success: true, 
    message: 'Form submitted successfully. We will get back to you shortly.' 
  });
}
