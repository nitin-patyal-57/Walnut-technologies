import mongoose from 'mongoose';
import { config } from '../config.js';

const auditLogSchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: String, // kept even if the user is later removed
  action: { type: String, required: true, index: true },
  target: String,
  meta: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String,
});

auditLogSchema.index({ at: -1 });
auditLogSchema.index({ at: 1 }, { expireAfterSeconds: config.auditRetentionDays * 24 * 60 * 60 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
