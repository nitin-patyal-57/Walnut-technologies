import mongoose from 'mongoose';

// One row per signed-in browser. The refresh token rotates on every use;
// presenting the previous token again means it was stolen → session revoked.
const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    prevTokenHash: { type: String, index: true },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date, default: Date.now },
    revokedAt: Date,
    revokeReason: String,
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);

// Expired sessions are cleaned up by MongoDB a day after they end.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

sessionSchema.methods.isActive = function isActive(idleMs) {
  const now = Date.now();
  return !this.revokedAt && this.expiresAt.getTime() > now && now - this.lastUsedAt.getTime() < idleMs;
};

export const Session = mongoose.model('Session', sessionSchema);
