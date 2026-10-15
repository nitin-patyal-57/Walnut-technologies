import mongoose from 'mongoose';
import { ROLES } from '../lib/permissions.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    role: { type: String, enum: ROLES, required: true },
    status: { type: String, enum: ['invited', 'active', 'disabled'], default: 'invited' },
    passwordHash: { type: String, select: false },
    passwordChangedAt: Date,

    failedLoginCount: { type: Number, default: 0 },
    lockUntil: Date,
    lastLoginAt: Date,
    lastLoginIp: String,

    mfa: {
      enabled: { type: Boolean, default: false },
      secretEnc: { type: String, select: false }, // AES-GCM encrypted TOTP seed
      pendingSecretEnc: { type: String, select: false }, // during enrolment
      recoveryCodeHashes: { type: [String], select: false },
      lastUsedStep: { type: Number, select: false }, // blocks code replay
    },

    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

userSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > new Date());
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    mfaEnabled: Boolean(this.mfa?.enabled),
    locked: this.isLocked(),
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
