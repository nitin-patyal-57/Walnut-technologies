import mongoose from 'mongoose';

export const LEAD_TYPES = ['contact', 'quote', 'resource', 'application'];
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost', 'spam'];

const noteSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: String,
    text: { type: String, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const leadSchema = new mongoose.Schema(
  {
    type: { type: String, enum: LEAD_TYPES, required: true, index: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'new', index: true },
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, maxlength: 20 },
    company: { type: String, maxlength: 100 },
    subject: { type: String, maxlength: 200 },
    message: { type: String, maxlength: 4000 },
    quantity: { type: String, maxlength: 50 },
    resourceTitle: { type: String, maxlength: 200 },
    jobTitle: { type: String, maxlength: 200 },
    resume: {
      fileId: mongoose.Schema.Types.ObjectId, // GridFS "resumes" bucket
      filename: String,
      size: Number,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: [noteSchema],
    ip: String,
    source: { type: String, default: 'website' },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text', company: 'text', subject: 'text', message: 'text', jobTitle: 'text' });

export const Lead = mongoose.model('Lead', leadSchema);
