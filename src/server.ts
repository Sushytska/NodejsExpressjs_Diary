import app from './app.js'; // Importing the Express application instance from app.ts
import config from './config/config.js';
import logger from './logger/index.js'; // Importing the logger instance for logging
import { gracefulShutdown } from './utils/gracefulShutdown.js';

app.listen(config.port, () => {
  logger.info(`Server is running on http://localhost:${config.port}`);
});

process.once('exit', (code) => gracefulShutdown(code));
process.once('uncaughtException', (err) => {
  logger.error('Uncaught Exception: ', err);
  gracefulShutdown(1);
}); // Handling uncaught exceptions to gracefully shut down the server
process.once('SIGINT', () => gracefulShutdown(0)); // Handling SIGINT (Ctrl+C) to gracefully shut down the server
process.once('SIGTERM', () => gracefulShutdown(0)); // kill command to gracefully shut down the server
process.once('SIGUSR2', () => {
  logger.info('SIGUSR2 received, restarting server...'); // nodemon started restarting the server on file changes
  gracefulShutdown(0).then(() => {
    process.kill(process.pid, 'SIGUSR2'); // passing the SIGUSR2 signal back to nodemon ((current process) process.pid) to finish restarting of server
  });
}); // Handling SIGUSR2 for nodemon restarts
