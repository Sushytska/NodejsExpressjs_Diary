import express from 'express'; // Importing the express module to create a web server
import noteRoutes from './routes/noteRoute.js';
import authRouter from './routes/authRoute.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectToDatabase } from './database/init.js';
import { cleanUpTokenDB } from './middlewares/cleanUpTokenDB.js';
import cookieParser from 'cookie-parser'; // Importing cookie-parser to handle cookies in requests

export async function startup() {
  const app = express(); // Creating an instance of an Express application

  app.use(express.json()); // Middleware to parse JSON request bodies, then we can use req.body to access the parsed data

  app.use(cookieParser());

  await connectToDatabase(); // Connecting to the database before starting the server

  app.use(cleanUpTokenDB); // Middleware to clean up old tokens from the database

  app.get('/api', (req, res) => {
    res.send('🚀 Server is up and running!');
  });

  app.use('/api/notes', noteRoutes); // Mounting the noteRoutes on the '/notes' path
  app.use('/api/auth', authRouter); // Mounting the authRouter on the '/auth' path

  app.use(errorHandler); // This middleware will catch all requests that do not match any defined routes and respond with a 404 status code
  return app; // Returning the Express application instance for use in other parts of the application
}
