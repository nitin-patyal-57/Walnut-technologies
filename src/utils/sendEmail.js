const API_BASE = '/api';

async function submitForm(endpoint, data) {
  let response;
  try {
    response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch {
    // fetch() only rejects when no response arrives at all (server down, no
    // network). Surface that in plain words instead of "Failed to fetch".
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }

  let result;
  try {
    result = await response.json();
  } catch {
    // Non-JSON body (e.g. an HTML error page) — fall back below.
    result = {};
  }

  if (!response.ok) {
    // Prefer the server's own message, e.g. "Message is required".
    throw new Error(result.error || 'Failed to submit form');
  }

  return result;
}

export async function sendQuoteEmail(form) {
  return submitForm('contact', {
    name: form.name,
    email: form.email,
    phone: form.phone,
    company: form.company,
    subject: form.product,
    quantity: form.quantity,
    message: form.message,
    type: 'quote',
    website: form.website || '',
    formTime: form.formTime || '',
  });
}

export async function sendContactEmail(form) {
  return submitForm('contact', {
    name: form.name,
    email: form.email,
    phone: form.phone,
    company: form.company,
    subject: form.subject,
    message: form.message,
    type: 'contact',
    website: form.website || '',
    formTime: form.formTime || '',
  });
}

export async function sendResourceRequest(form) {
  return submitForm('contact', {
    name: form.name,
    email: form.email,
    resourceTitle: form.resourceTitle,
    message: form.message || '',
    type: 'resource',
    website: form.website || '',
    formTime: form.formTime || '',
  });
}

export async function sendApplication(form) {
  return submitForm('contact', {
    name: form.name,
    email: form.email,
    phone: form.phone,
    company: form.company || '',
    jobTitle: form.jobTitle,
    message: form.message,
    resume: form.resume || null,
    type: 'application',
    website: form.website || '',
    formTime: form.formTime || '',
  });
}
