import mongoose from 'mongoose';

// Metadata for an uploaded image. The bytes live in the GridFS "media" bucket.
const mediaSchema = new mongoose.Schema(
  {
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true }, // url-safe, .webp
    originalName: String,
    alt: { type: String, maxlength: 200, default: '' },
    width: Number,
    height: Number,
    size: Number,
    contentType: { type: String, default: 'image/webp' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedByName: String,
  },
  { timestamps: true },
);

mediaSchema.index({ createdAt: -1 });

export const Media = mongoose.model('Media', mediaSchema);
