import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const HMAC_SECRET = process.env.HMAC_SECRET;

export function validateHMAC(req: Request, res: Response, next: NextFunction) {
  if (!HMAC_SECRET) {
    throw new Error('HMAC_SECRET environment variable is not set');
  }

  const signature = req.headers['x-mcp-sig'];
  if (!signature) {
    return res.status(401).json({ error: 'Missing HMAC signature' });
  }

  const body = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', HMAC_SECRET);
  hmac.update(body);
  const calculatedSignature = hmac.digest('hex');

  if (signature !== calculatedSignature) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  next();
}