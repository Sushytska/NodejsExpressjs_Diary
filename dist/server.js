"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app")); // Importing the Express application instance from app.ts
const config_1 = __importDefault(require("./config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger")); // Importing the logger instance for logging
app_1.default.listen(config_1.default.port, () => {
    console.log(`Server is running on http://localhost:${config_1.default.port}`); // Starting the server and logging the URL to the console
});
function appExitHandler(code) {
    logger_1.default.info(`Server process has been exited with code ${code}`);
}
function appUncaughtExceptionHandler(err, origin) {
    logger_1.default.error(`Uncaught exception occurred at ${origin}`, err);
    process.exit(1);
}
process.on("exit", appExitHandler);
process.on("uncaughtException", appUncaughtExceptionHandler);
process.on('SIGINT', async () => {
    try {
        await mongoose_1.default.disconnect(); // Closing the all database connection gracefully, clear the ceshe, and release resources
        // This is important to ensure that the application exits cleanly
        // if your don't close the connection, after every starting of the server, it will create a new connection cause the memory leak, accumulating connections, 
        // and eventually crash the application.
        console.log("Database connection closed.");
        process.exit(0); // Exit the process with a success code
    }
    catch (error) {
        console.error("Error closing the database connection:", error);
        process.exit(1); // Exit the process with an error code if closing the connection fails
    }
}); // Listening for the SIGINT signal to close the database connection gracefully
//# sourceMappingURL=server.js.map