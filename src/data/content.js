// Site content is managed in the Walnut Admin panel and published into
// content.json by scripts/fetch-content.mjs at build time. Edit content in the
// admin (or content.json directly when working without it) — not here.
import data from './content.json';

export const brand = data.brand;
export const about = data.about;
export const trustSignals = data.trustSignals;
export const divisions = data.divisions;
export const products = data.products;
export const process = data.process;
export const industryFourTechnologies = data.industryFourTechnologies;
export const impactBenefits = data.impactBenefits;
export const expertise = data.expertise;
export const clientSectors = data.clientSectors;
export const clientLogos = Array.isArray(data.clientLogos) ? data.clientLogos : [];
export const certifications = Array.isArray(data.certifications) ? data.certifications : [];
export const journey = Array.isArray(data.journey) ? data.journey : [];
export const careers = Array.isArray(data.careers) ? data.careers : [];
export const resources = data.resources;
export const news = data.news;
export const chatbot = data.chatbot;
export const pages = Array.isArray(data.pages) ? data.pages : [];
