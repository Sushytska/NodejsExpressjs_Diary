import express from 'express'; // Importing the express module to create a web server

const app = express(); // Creating an instance of an Express application
const PORT = process.env.PORT || 3000; // Setting the port to listen on, defaulting to 3000 if not specified in environment variables
let notes = []; // Initializing an empty array to store notes

app.use(express.json()); // Middleware to parse JSON request bodies, allowing us to access req.body in route handlers
//if not do it then req.body will be undefined for JSON requests, because Express does not parse JSON by default

// Middleware: logging
app.use((req, res, next) => {
  console.log('🔍 1 Middleware: логування 1');
  next(); // go to the next middleware or route handler
}); // Middleware for logging requests, calling next() to pass control to the next middleware or route handler

app.get('/', (req, res) => {
    res.send('Hello, Express.js!');
}); // Defining a route for the root URL that responds with a simple message

// Middleware: логування
app.use((req, res, next) => {
  console.log('🔍 2 Middleware: логування 2');
  next(); // go to the next middleware or route handler
});// Middleware for logging requests again, calling next() to pass control to the next middleware or route handler

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
}); // Defining another route that responds with a different message

app.use((req, res, next) => {
  console.log('🔍 3 Middleware: логування 3');
  if (req.method === 'POST' && req.originalUrl == "/echo" && req.body.age >= 18) {
    next(); // go to the next middleware or route handler if age is 18 or older
  }
  else if (req.originalUrl !== "/echo") {
    next(); // go to the next middleware or route handler if the URL is not "/echo"
  }
  else {
    res.status(403).send('Access denied. You must be at least 18 years old.'); // Responding with a 403 Forbidden status if age is less than 18
  }
});// Middleware for logging requests again, calling next() to pass control to the next middleware or route handler

app.post('/echo', (req, res) => {
  res.json({ received: req.body }); // Responding with the request body as a JSON object
}); // Defining a POST route that echoes back the request body as a JSON string

app.use((req, res, next) => {
  console.log('🔍 4 Middleware: логування 4');
  if (req.method === 'GET' && req.originalUrl == "/notes") {
    if (notes.length === 0) {
        return res.status(404).send('No notes found'); // Responding with a 404 Not Found status if there are no notes
    }
    next(); // go to the next middleware or route handler if notes exist
  }
  else {
    next(); // go to the next middleware or route handler if the URL is not "/notes"
  }
});

app.get('/notes', (req, res) => {
    res.send('Your notes: ' + JSON.stringify(notes)); // Defining a route for '/notes' that responds with a message
}); // Responding with a message when the '/notes' route is accessed

app.use((req, res, next) => {
  console.log('🔍 5 Middleware: логування 5');
  if (req.method === 'POST' && req.originalUrl == "/notes") {
    if (!req.body.note) {
        return res.status(400).send('Note content is required'); // Responding with a 400 Bad Request status if no note content is provided
    }
    next(); // go to the next middleware or route handler if note content is provided
  }
  else {
    next(); // go to the next middleware or route handler if the URL is not "/notes"
  }
});

app.post('/notes', (req, res) => {
    notes.push(req.body.note); // Adding the note from the request body to the notes array
    res.status(201).send('Note added successfully'); // Responding with a 201 Created status and a success message
}); // Responding with a message when the '/notes' route is accessed

app.use((req, res, next) => {
  console.log('🔍 6 Middleware: логування 6');
  if (req.method === 'DELETE' && req.originalUrl == "/notes") {
    if (!req.query.id) {
        return res.status(400).send('Note ID is required'); // Responding with a 400 Bad Request status if no note ID is provided
    }
    next(); // go to the next middleware or route handler if note ID is provided
  }
  else {
    next(); // go to the next middleware or route handler if the URL is not "/notes"
  }
});

app.delete('/notes', (req, res) => { //or app.delete('/notes/:id', (req, res) => {
    const id = req.query.id; // Extracting the note ID from the request parameters
    if (id >= 0 && id < notes.length) {
        notes.splice(id, 1); // Removing the note at the specified index from the notes array
        res.send('Note deleted successfully'); // Responding with a success message
    } else {
        res.status(404).send('Note not found'); // Responding with a 404 Not Found status if the note ID is invalid
    }
}); // Responding with a message when the '/notes' route is accessed

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); // Starting the server and logging the URL to the console
// The server will listen for incoming requests on the specified port
