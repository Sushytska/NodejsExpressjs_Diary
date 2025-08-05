import dotenv from 'dotenv'; // Importing dotenv to manage environment variables

dotenv.config(); // Load environment variables from .env file

interface Config {
    port: number; // Port number for the server
    nodeEnv: string; // Node environment (development, production, etc.)
}

const config: Config = {
    port: Number(process.env.PORT) || 3000, // Default to 3000 if PORT is not set
    nodeEnv: process.env.NODE_ENV || 'development', // Default to 'development' if NODE_ENV is not set
};

export default config; // Exporting the config object to be used in other parts of the application