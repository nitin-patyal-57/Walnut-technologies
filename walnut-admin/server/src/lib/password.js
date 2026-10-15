import bcrypt from 'bcryptjs';

const COST = 12;
const COMMON = new Set([
  'password', 'password1', 'password123', '1234567890', '12345678910', 'qwertyuiop',
  'qwerty12345', 'iloveyou12', 'admin12345', 'welcome123', 'letmein123', 'walnut1234',
  'walnut@123', 'walnut12345', 'abc1234567', 'passw0rd123',
]);

// A precomputed hash so "unknown email" takes as long as "wrong password".
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', COST);

export const hashPassword = (plain) => bcrypt.hash(plain, COST);

export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash || DUMMY_HASH);

// Returns an error message, or null if the password is acceptable.
export function checkPasswordPolicy(password, email = '') {
  if (typeof password !== 'string' || password.length < 10) return 'Password must be at least 10 characters.';
  if (password.length > 128) return 'Password must be at most 128 characters.';
  if (COMMON.has(password.toLowerCase())) return 'This password is too common.';
  const local = email.split('@')[0].toLowerCase();
  if (local.length >= 4 && password.toLowerCase().includes(local)) return 'Password must not contain your email name.';
  if (!/[a-zA-Z]/.test(password) || !/[0-9\W_]/.test(password)) {
    return 'Use a mix of letters and numbers or symbols.';
  }
  return null;
}
