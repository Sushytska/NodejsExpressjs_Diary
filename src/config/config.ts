import dotenv from 'dotenv'; // Importing dotenv to manage environment variables

dotenv.config(); // Load environment variables from .env file to process.env

interface Config {
    port: number; // Port number for the server
    nodeEnv: string; // Node environment (development, production, etc.)
    dbUri: string; // MongoDB URI for database connection
}

const config: Config = {
    port: Number(process.env.PORT) || 3000, // Default to 3000 if PORT is not set
    nodeEnv: process.env.NODE_ENV || 'development', // Default to 'development' if NODE_ENV is not set
    dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/diary', // Default MongoDB URI
};

export default config; // Exporting the config object to be used in other parts of the application