"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importing the express module to create a web server
const noteRoute_1 = __importDefault(require("./routes/noteRoute"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)(); // Creating an instance of an Express application
app.use(express_1.default.json()); // Middleware to parse JSON request bodies, then we can use req.body to access the parsed data
app.use('/notes', noteRoute_1.default); // Mounting the noteRoutes on the '/notes' path
app.use(errorHandler_1.errorHandler); // This middleware will catch all requests that do not match any defined routes and respond with a 404 status code
exports.default = app; // Exporting the Express application instance to be used in other files, such as the server file
