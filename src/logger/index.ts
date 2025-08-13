import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
}); 

const logger = createLogger({
    level: 'info', // Default log level
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
        new transports.File({ filename: 'combined.log' }) // Log all messages to a combined file
    ]
});

export default logger; // Exporting the logger instance to be used in other files

