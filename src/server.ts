import app from './app'; // Importing the Express application instance from app.ts
import config from './config/config';

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`); // Starting the server and logging the URL to the console
}); 