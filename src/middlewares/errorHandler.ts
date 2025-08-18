import { Request, Response } from 'express';
import config from '../config/config.js';
import logger from '../logger/index.js';

export const errorHandler = (err: any, req: Request, res: Response) => {
  logger.error('Error: ', err);
  const status = err.status || 500; // Use the error's status or default to 500
  res.status(status).json({
    message: err.message || 'Internal Server Error', // Respond with the error message or a generic message
    stack: config.nodeEnv === 'development' ? err.stack : undefined, // Include stack trace in development mode
  });
};
