"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("../logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error("Error: ", err);
    const status = err.status || 500; // Use the error's status or default to 500
    res.status(status).json({
        message: err.message || 'Internal Server Error', // Respond with the error message or a generic message
        stack: config_1.default.nodeEnv === 'development' ? err.stack : undefined // Include stack trace in development mode
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map