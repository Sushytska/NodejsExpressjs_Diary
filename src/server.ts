import app from './app.js'; // Importing the Express application instance from app.ts
import config from './config/config.js';
import mongoose from 'mongoose'; // Importing mongoose for MongoDB object modeling
import logger from './logger/index.js'; // Importing the logger instance for logging

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`); // Starting the server and logging the URL to the console
});

function appExitHandler(code: number) {
  logger.info(`Server process has been exited with code ${code}`);
}

function appUncaughtExceptionHandler(err: Error, origin: string) {
  logger.error(`Uncaught exception occurred at ${origin}`, err);
  process.exit(1);
}

process.on('exit', appExitHandler);
process.on('uncaughtException', appUncaughtExceptionHandler);

process.on('SIGINT', async () => {
  // Handling the SIGINT signal (Ctrl+C)
  try {
    await mongoose.disconnect(); // Closing the all database connection gracefully, clear the ceshe, and release resources
    // This is important to ensure that the application exits cleanly
    // if your don't close the connection, after every starting of the server, it will create a new connection cause the memory leak, accumulating connections,
    // and eventually crash the application.
    console.log('Database connection closed.');
    process.exit(0); // Exit the process with a success code
  } catch (error) {
    console.error('Error closing the database connection:', error);
    process.exit(1); // Exit the process with an error code if closing the connection fails
  }
}); // Listening for the SIGINT signal to close the database connection gracefully
