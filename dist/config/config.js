import dotenv from 'dotenv'; // Importing dotenv to manage environment variables
dotenv.config(); // Load environment variables from .env file to process.env
const config = {
    port: Number(process.env.PORT) || 3000, // Default to 3000 if PORT is not set
    nodeEnv: process.env.NODE_ENV || 'development', // Default to 'development' if NODE_ENV is not set
    dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/diary', // Default MongoDB URI
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'secret', // Default token secret, can be used for JWT or other purposes
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret', // Default refresh token secret
    jwtAccessExpiration: Number(process.env.JWT_ACCESS_EXPIRATION) || 900, // Default access token expiration time
    jwtRefreshExpiration: Number(process.env.JWT_REFRESH_EXPIRATION) || 604800, // Default refresh token expiration time
};
export default config; // Exporting the config object to be used in other parts of the application
//# sourceMappingURL=config.js.map