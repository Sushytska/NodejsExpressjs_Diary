import mongoose from 'mongoose'; // Importing mongoose for MongoDB object modeling
import config from '../config/config.js'; // Importing the configuration

const uri = config.dbUri; // Getting the MongoDB URI from the config

export async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      socketTimeoutMS: 300000, // Setting socket timeout to 30 seconds
    }); // Connecting to the MongoDB database using the URI from the config
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with an error code if the connection fails
  }
}
