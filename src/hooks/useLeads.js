const STORAGE_KEY = 'walnut-leads';

function getLeads() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.warn('Failed to save lead:', e);
  }
}

export function useLeads() {
  const submitLead = (leadData) => {
    const lead = {
      ...leadData,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      timestamp: new Date().toISOString(),
      source: leadData.source || 'unknown',
    };

    const leads = getLeads();
    leads.push(lead);
    saveLeads(leads);

    // Also dispatch a custom event so other components can listen
    window.dispatchEvent(new CustomEvent('walnut-new-lead', { detail: lead }));

    return lead;
  };

  const getAllLeads = () => getLeads();

  const getLeadCount = () => getLeads().length;

  const clearLeads = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { submitLead, getAllLeads, getLeadCount, clearLeads };
}

// Simple named export for direct import of the function
export function captureLead(data) {
  const lead = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    timestamp: new Date().toISOString(),
    source: data.source || 'unknown',
  };

  const leads = getLeads();
  leads.push(lead);
  saveLeads(leads);

  window.dispatchEvent(new CustomEvent('walnut-new-lead', { detail: lead }));
  return lead;
}
