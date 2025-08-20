import { RefreshToken } from '../models/refreshTokenModel.js';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger.js';

export const cleanUpTokenDB = (req: Request, res: Response, next: NextFunction) => {
  // Delete revoked tokens older than 30 days
  RefreshToken.deleteMany({
    revoked: true,
    expiresAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  })
    .then(() => {
      logger.info('Cleaned up old revoked tokens from the database');
      next();
    })
    .catch((error) => {
      logger.error('Error cleaning up old revoked tokens:', error);
      next(error); // Pass the error to the next middleware
    });
};
