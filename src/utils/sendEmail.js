const RECIPIENT = 'contact@walnutmedical.in';

function encodeParams(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== '' && v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}: ${encodeURIComponent(v)}`)
    .join('%0A');
}

export function sendEmail({ subject, body }) {
  const bodyEncoded = encodeParams(body);
  const mailtoLink = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${bodyEncoded}`;
  window.location.href = mailtoLink;
}

export function sendQuoteEmail(form) {
  sendEmail({
    subject: `New Quote Request - ${form.product || 'General'}`,
    body: {
      Name: form.name,
      Email: form.email,
      Phone: form.phone,
      Company: form.company,
      'Product Type': form.product,
      Quantity: form.quantity,
      Message: form.message,
    },
  });
}

export function sendContactEmail(form) {
  sendEmail({
    subject: form.subject || 'New Contact Message',
    body: {
      Name: form.name,
      Email: form.email,
      Phone: form.phone,
      Company: form.company,
      Subject: form.subject,
      Message: form.message,
    },
  });
}
