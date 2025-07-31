import { Note } from '../models/note';
import { RequestHandler } from 'express';


const NOTES: Note[] = [];

export const createNote: RequestHandler = (req, res, next) => { // Middleware to handle note creation
    if (!req.body.note) {
        return res.status(400).send('Note content is required'); // Responding with a 400 Bad Request status if no note content is provided
    }

    const newNote = new Note(Math.random().toString(), req.body.note);

    NOTES.push(newNote);

    res.status(201).json({ message: 'Note was created successfully', note: newNote});

    next(); // go to the next middleware or route handler if note content is provided
};

export const getNotes: RequestHandler = (req, res, next) => { // Middleware to handle fetching all notes
    if (NOTES.length === 0) {
        return res.status(404).json({ message: 'No notes found' }); // Responding with a 404 Not Found status if no notes exist
    }

    res.status(200).json({ message: 'Notes fetched successfully', notes: NOTES });

    next(); // go to the next middleware or route handler if notes exist
};

export const updateNote: RequestHandler = (req, res, next) => {
    if (!req.query.id){
        return res.status(400).json({ message: 'Note ID is required'}); // Responding with a 400 Bad Request status if no note ID is provided
    }

    const noteId = req.query.id as string;
    const noteIndex = NOTES.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' }); // Responding with a 404 Not Found status if the note does not exist
    }

    const updateContent = req.body.note as string;
    const updateNote = new Note(noteId, updateContent);

    NOTES[noteIndex] = updateNote; // Updating the note in the array

    res.status(200).json({ message: 'Note updated successfully', note: updateNote });

    next(); // go to the next middleware or route handler if note ID is provided    
};

export const deleteNote: RequestHandler = (req, res, next) => {
    if (!req.query.id) {
        return res.status(400).json({ message: 'Note ID is required' }); // Responding with a 400 Bad Request status if no note ID is provided
    }

    const noteId = req.query.id as string;
    const noteIndex = NOTES.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' }); // Responding with a 404 Not Found status if the note does not exist
    }

    NOTES.splice(noteIndex, 1); // Removing the note from the array

    res.status(200).json({ message: 'Note deleted successfully' });

    next(); // go to the next middleware or route handler if note ID is provided
};