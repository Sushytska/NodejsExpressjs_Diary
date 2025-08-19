import { NextFunction, Request, Response } from 'express';
import config from '../config/config.js';
import logger from '../logger/logger.js';
import { HttpError } from '../utils/HttpError.js';

export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message || 'An error occurred'); // Log the error message
  const status = err.status || 500; // Use the error's status or default to 500
  res.status(status).json({
    message: err.message || 'Internal Server Error', // Respond with the error message or a generic message
    stack: config.nodeEnv === 'development' ? err.stack : undefined, // Include stack trace in development mode
  });
};
