import express from 'express'; // Importing the express module to create a web server
import noteRoutes from './routes/noteRoute.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectToDatabase } from './database/init.js';
import { cleanUpTokenDB } from './middlewares/cleanUpTokenDB.js';

const app = express(); // Creating an instance of an Express application

app.use(express.json()); // Middleware to parse JSON request bodies, then we can use req.body to access the parsed data

(async () => {
  await connectToDatabase(); // Connecting to the database before starting the server
})();

app.use(cleanUpTokenDB); // Middleware to clean up old tokens from the database

app.use('/notes', noteRoutes); // Mounting the noteRoutes on the '/notes' path

app.use(errorHandler); // This middleware will catch all requests that do not match any defined routes and respond with a 404 status code

export default app; // Exporting the Express application instance to be used in other files, such as the server file
