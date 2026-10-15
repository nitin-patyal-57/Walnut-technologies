// Break-glass: clears two-factor for one account, unlocks it and signs it out
// everywhere. Use only when no other Super Admin can do it from the UI.
//   npm run reset-mfa -- --email someone@walnutmedical.in
import { connectDb, disconnectDb } from '../src/db.js';
import { AuditLog } from '../src/models/AuditLog.js';
import { Session } from '../src/models/Session.js';
import { User } from '../src/models/User.js';

const i = process.argv.indexOf('--email');
const email = (i > -1 ? process.argv[i + 1] : '').trim().toLowerCase();
if (!email) {
  console.error('Usage: npm run reset-mfa -- --email someone@walnutmedical.in');
  process.exit(1);
}

await connectDb();
const user = await User.findOne({ email });
if (!user) {
  console.error(`No user with email ${email}`);
} else {
  user.mfa = { enabled: false };
  user.lockUntil = undefined;
  user.failedLoginCount = 0;
  await user.save();
  await Session.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date(), revokeReason: 'mfa-reset-cli' });
  await AuditLog.create({ action: 'user.mfa_reset', actorEmail: 'server-console', target: email, meta: { via: 'cli' } });
  console.log(`Two-factor cleared for ${email}. ${user.role === 'superadmin' ? 'They must set it up again at next sign-in.' : ''}`);
}
await disconnectDb();
