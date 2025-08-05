"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); // Importing dotenv to manage environment variables
dotenv_1.default.config(); // Load environment variables from .env file
const config = {
    port: Number(process.env.PORT) || 3000, // Default to 3000 if PORT is not set
    nodeEnv: process.env.NODE_ENV || 'development', // Default to 'development' if NODE_ENV is not set
};
exports.default = config; // Exporting the config object to be used in other parts of the application
