// Creates the first Super Admin and prints a one-time link to set the password.
//   npm run create-admin -- --email you@walnutmedical.in --name "Your Name"
// (or set SEED_ADMIN_EMAIL / SEED_ADMIN_NAME in .env)
import { config } from '../src/config.js';
import { randomToken, sha256 } from '../src/lib/crypto.js';
import { connectDb, disconnectDb } from '../src/db.js';
import { User } from '../src/models/User.js';
import { UserToken } from '../src/models/UserToken.js';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const email = (arg('email') || process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
const name = (arg('name') || process.env.SEED_ADMIN_NAME || '').trim();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || name.length < 2) {
  console.error('Usage: npm run create-admin -- --email you@walnutmedical.in --name "Your Name"');
  process.exit(1);
}

await connectDb();

let user = await User.findOne({ email });
if (user && user.status === 'active') {
  console.error(`${email} already exists and is active. Use "Forgot password" on the sign-in page instead.`);
  await disconnectDb();
  process.exit(1);
}
if (!user) user = await User.create({ email, name, role: 'superadmin', status: 'invited' });
else Object.assign(user, { role: 'superadmin', name });
await user.save();

await UserToken.deleteMany({ user: user._id, type: 'invite' });
const token = randomToken();
await UserToken.create({ user: user._id, type: 'invite', tokenHash: sha256(token), expiresAt: new Date(Date.now() + config.inviteTtlMs) });

console.log(`\nSuper Admin ${name} <${email}> created.`);
console.log('Open this link to set the password (valid 72 hours, single use):\n');
console.log(`  ${config.appUrl}/accept-invite?token=${token}\n`);
console.log('You will be asked to set up two-factor authentication after signing in.');
await disconnectDb();
