import { Request, Response } from 'express';

export function healthCheck(req: Request, res: Response) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}