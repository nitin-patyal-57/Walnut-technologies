import { Readable } from 'node:stream';
import mongoose from 'mongoose';

const buckets = {};

export function bucket(name) {
  if (!buckets[name]) {
    buckets[name] = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: name });
  }
  return buckets[name];
}

export function saveBuffer(bucketName, filename, buffer, contentType) {
  return new Promise((resolve, reject) => {
    const upload = bucket(bucketName).openUploadStream(filename, { metadata: { contentType } });
    Readable.from(buffer).pipe(upload).on('error', reject).on('finish', () => resolve(upload.id));
  });
}

export async function deleteFile(bucketName, id) {
  try {
    await bucket(bucketName).delete(new mongoose.Types.ObjectId(id));
  } catch (err) {
    if (!/FileNotFound/i.test(err.message)) throw err;
  }
}

export function streamFile(bucketName, id) {
  return bucket(bucketName).openDownloadStream(new mongoose.Types.ObjectId(id));
}
