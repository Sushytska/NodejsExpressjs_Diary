import mongoose from 'mongoose'; // Importing mongoose for MongoDB object modeling
import config from '../config/config.js'; // Importing the configuration
import logger from '../logger/logger.js'; // Importing the logger instance for logging

const uri = config.dbUri; // Getting the MongoDB URI from the config

export async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      socketTimeoutMS: 300000, // Setting socket timeout to 30 seconds
    }); // Connecting to the MongoDB database using the URI from the config
    logger.info('Connected to the database successfully'); // Logging a success message if the connection is established
  } catch (error) {
    logger.error('Database connection failed:', error); // Logging an error message if the connection fails
    process.exit(1); // Exit the process with an error code if the connection fails
  }
}
