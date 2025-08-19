import mongoose from 'mongoose'; // Importing mongoose for database connection management
import logger from '../logger/logger.js'; // Importing the logger instance for logging

// Closing the all database connection gracefully, clear the ceshe, and release resources
// This is important to ensure that the application exits cleanly
// if your don't close the connection, after every starting of the server, it will create a new connection cause the memory leak, accumulating connections,
// and eventually crash the application.
export async function gracefulShutdown(code: number | null) {
  try {
    logger.info(`Server process has been exited with code ${code}`);
    await mongoose.disconnect(); // Closing the database connection gracefully
    logger.info('Database connection closed gratefully.'); // Logging the closure of the database connection
  } catch (error) {
    logger.error('Error closing the database connection:', error);
  } finally {
    process.exit(code ?? 0); // Exit the process with the provided code or 0 if null
  }
}
