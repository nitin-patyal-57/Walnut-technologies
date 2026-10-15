import mongoose from 'mongoose';

// One document per content collection (brand, divisions, news, ...).
// Editors change `draft`; Publish copies every draft to `published`.
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    draft: mongoose.Schema.Types.Mixed,
    published: mongoose.Schema.Types.Mixed,
    draftUpdatedAt: Date,
    draftUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: Date,
  },
  { minimize: false },
);

// Full snapshot of the published site content, one per publish — used for rollback.
const contentVersionSchema = new mongoose.Schema(
  {
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    changedKeys: [String],
    note: { type: String, maxlength: 300 },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedByName: String,
    restoredFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentVersion' },
    deploy: {
      status: { type: String, enum: ['triggered', 'skipped', 'failed'] },
      detail: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, minimize: false },
);

export const Content = mongoose.model('Content', contentSchema);
export const ContentVersion = mongoose.model('ContentVersion', contentVersionSchema);
