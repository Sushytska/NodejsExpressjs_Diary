import { Note } from '../models/noteModel';
import { RequestHandler } from 'express';
import { HttpError } from '../utils/HttpError';

const NOTES: Note[] = [];

export const createNote: RequestHandler = (req, res, next) => { // Middleware to handle note creation
    try {
        if (!req.body.note) {
            return next(new HttpError('Note content is required', 400)); // Using the errorHandler middleware to handle the error
        }

        const newNote = new Note(Math.random().toString(), req.body.note);

        NOTES.push(newNote);

        res.status(201).json({ message: 'Note was created successfully', note: newNote});
    } catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};

export const getNotes: RequestHandler = (req, res, next) => { // Middleware to handle fetching all notes
    try {
        if (NOTES.length === 0) {
            return next(new HttpError('No notes found', 404)); // Using the errorHandler middleware to handle the error
        }

        res.status(200).json({ message: 'Notes fetched successfully', notes: NOTES });
    } catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};

export const updateNote: RequestHandler = (req, res, next) => {
    try {
        if (!req.params.id){
            return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }

        const noteId = req.params.id as string;
        const noteIndex = NOTES.findIndex(note => note.id === noteId);

        if (noteIndex === -1) {
            return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }

        const existingNote = NOTES[noteIndex];
        const updatedNote = {
            ...existingNote, // Keeping the existing note properties
            ...req.body // Updating the content with the new note content from the request body
        }

        NOTES[noteIndex] = updatedNote; // Updating the note in the array

        res.status(200).json({ message: 'Note updated successfully', note: updatedNote });  
    } catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};

export const deleteNote: RequestHandler = (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }

        const noteId = req.params.id as string;
        const noteIndex = NOTES.findIndex(note => note.id === noteId);

        if (noteIndex === -1) {
            return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }

        NOTES.splice(noteIndex, 1); // Removing the note from the array

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};