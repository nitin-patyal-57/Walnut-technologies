const STORAGE_KEY = 'walnut-leads';
const MAX_LEADS = 50;
const EXPIRY_HOURS = 24;

function getLeads() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const leads = JSON.parse(data);
    const now = Date.now();
    const filtered = leads.filter((lead) => {
      if (!lead.timestamp) return false;
      const age = now - new Date(lead.timestamp).getTime();
      return age < EXPIRY_HOURS * 60 * 60 * 1000;
    });
    if (filtered.length !== leads.length) saveLeads(filtered);
    return filtered;
  } catch {
    return [];
  }
}

function saveLeads(leads) {
  try {
    const trimmed = leads.slice(-MAX_LEADS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
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

    window.dispatchEvent(new CustomEvent('walnut-new-lead', { detail: lead }));
    return lead;
  };

  const getAllLeads = () => getLeads();
  const getLeadCount = () => getLeads().length;
  const clearLeads = () => localStorage.removeItem(STORAGE_KEY);

  return { submitLead, getAllLeads, getLeadCount, clearLeads };
}

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
