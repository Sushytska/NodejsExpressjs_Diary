import express, { Request, Response, NextFunction } from 'express'; // Importing the express module to create a web server
import noteRoutes from './routes/noteRoute';
import { errorHandler } from './middlewares/errorHandler';

const app = express(); // Creating an instance of an Express application

app.use(express.json()); // Middleware to parse JSON request bodies, then we can use req.body to access the parsed data

app.use('/notes', noteRoutes); // Mounting the noteRoutes on the '/notes' path

app.use(errorHandler); // This middleware will catch all requests that do not match any defined routes and respond with a 404 status code

export default app; // Exporting the Express application instance to be used in other files, such as the server file
