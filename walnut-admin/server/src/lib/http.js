import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(status, message, code, meta) {
    super(message);
    this.status = status;
    this.code = code;
    if (meta !== undefined) this.meta = meta;
  }
}

export const badRequest = (msg, code) => new HttpError(400, msg, code);
export const unauthorized = (msg = 'Not signed in', code = 'UNAUTHENTICATED') => new HttpError(401, msg, code);
export const forbidden = (msg = 'You do not have permission to do this', code = 'FORBIDDEN') => new HttpError(403, msg, code);
export const notFound = (msg = 'Not found') => new HttpError(404, msg, 'NOT_FOUND');
export const conflict = (msg = 'Someone else changed this first', meta) => new HttpError(409, msg, 'CONFLICT', meta);

// Parses req[part] with a zod schema, throwing a 400 with the first issue.
export function parse(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue.path.length ? `${issue.path.join('.')}: ` : '';
    throw badRequest(`${where}${issue.message}`, 'VALIDATION');
  }
  return result.data;
}

export const clientIp = (req) => req.ip || req.socket?.remoteAddress || 'unknown';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) err = badRequest(err.issues[0]?.message || 'Invalid input', 'VALIDATION');
  if (err?.type === 'entity.too.large') err = new HttpError(413, 'Request too large', 'TOO_LARGE');
  if (err?.name === 'MulterError') err = badRequest(err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message);
  if (err?.name === 'CastError') err = notFound();

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Something went wrong. Please try again.' : err.message,
    code: err.code,
    ...(err.meta !== undefined ? { meta: err.meta } : {}),
  });
}
