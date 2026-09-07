export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, subject, message, type } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Format email content
  const emailSubject = type === 'quote' 
    ? `New Quote Request - ${subject || 'General'}`
    : subject || 'New Contact Message';

  const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
${type === 'quote' ? `Product: ${subject || 'Not specified'}\nQuantity: ${req.body.quantity || 'Not specified'}` : `Subject: ${subject || 'Not specified'}`}
Message: ${message}
  `.trim();

  // Log to console (in production, integrate with email service)
  console.log('=== New Form Submission ===');
  console.log('Type:', type);
  console.log('Subject:', emailSubject);
  console.log('Body:', emailBody);
  console.log('===========================');

  // TODO: Integrate with email service (SendGrid, Resend, Nodemailer, etc.)
  // Example with fetch to an email API:
  /*
  await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: 'your_service_id',
      template_id: 'your_template_id',
      user_id: 'your_user_id',
      template_params: { name, email, phone, company, subject, message, type }
    })
  });
  */

  return res.status(200).json({ 
    success: true, 
    message: 'Form submitted successfully. We will get back to you shortly.' 
  });
}
