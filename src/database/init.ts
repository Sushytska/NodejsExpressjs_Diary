import mongoose from 'mongoose'; // Importing mongoose for MongoDB object modeling
import config from '../config/config'; // Importing the configuration

const uri = config.dbUri; // Getting the MongoDB URI from the config

export async function connectToDatabase() {
    try {
        await mongoose.connect(uri); // Connecting to the MongoDB database using the URI from the config
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit the process with an error code if the connection fails
    }
};

process.on('SIGINT', async () => { // Handling the SIGINT signal (Ctrl+C)
    try {
        await mongoose.disconnect(); // Closing the all database connection gracefully, clear the ceshe, and release resources
         // This is important to ensure that the application exits cleanly
         // if your don't close the connection, after every starting of the server, it will create a new connection cause the memory leak, accumulating connections, 
         // and eventually crash the application.
        console.log("Database connection closed.");
        process.exit(0); // Exit the process with a success code
    } catch (error) {
        console.error("Error closing the database connection:", error);
        process.exit(1); // Exit the process with an error code if closing the connection fails
    }       
}); // Listening for the SIGINT signal to close the database connection gracefully