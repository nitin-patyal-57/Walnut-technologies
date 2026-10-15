import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { decrypt, encrypt, randomToken, sha256 } from './crypto.js';

authenticator.options = { window: 1, step: 30 };

const ISSUER = 'Walnut Admin';

export async function createEnrolment(email) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, ISSUER, secret);
  const qrDataUrl = await QRCode.toDataURL(otpauth, { margin: 1, width: 220 });
  return { secret, secretEnc: encrypt(secret), qrDataUrl };
}

// Returns the matched time step, or null. Rejects a step already used (replay).
export function verifyTotp(code, secretEnc, lastUsedStep) {
  if (!/^\d{6}$/.test(code || '')) return null;
  const secret = decrypt(secretEnc);
  const delta = authenticator.checkDelta(code, secret);
  if (delta === null) return null;
  const step = Math.floor(Date.now() / 30000) + delta;
  if (lastUsedStep && step <= lastUsedStep) return null;
  return step;
}

export function generateRecoveryCodes() {
  const codes = Array.from({ length: 8 }, () => {
    const raw = randomToken(8).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase().padEnd(10, 'X');
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  });
  return { codes, hashes: codes.map((c) => sha256(c)) };
}

export const normalizeRecoveryCode = (code) => String(code || '').trim().toUpperCase();
