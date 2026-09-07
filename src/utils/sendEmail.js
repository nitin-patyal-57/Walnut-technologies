const API_BASE = '/api';

async function submitForm(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit form');
    }

    return result;
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
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
  });
}
