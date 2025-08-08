import { Note } from '../models/noteModel';
import { RequestHandler } from 'express';
import { HttpError } from '../utils/HttpError';

export const createNote: RequestHandler = async (req, res, next) => { // Middleware to handle note creation
    try {
        if (!req.body) {
            return next(new HttpError('Note content is required', 400)); // Using the errorHandler middleware to handle the error
        }

        const newNote = new Note(req.body);

        newNote.createdAt = new Date(); // Setting the createdAt date to now
        
        const savedNote = await newNote.save(); // Saving the note to the database

        res.status(201).json({ message: 'Note was created successfully', note: savedNote});
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', '); // Collecting validation error messages

            return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};

export const getNotes: RequestHandler = async (req, res, next) => { // Middleware to handle fetching all notes
    try {
        const notes = await Note.find(); // Fetching all notes from the database

        if (!notes) {
            return next(new HttpError('No notes found', 404)); // Using the errorHandler middleware to handle the error
        }

        res.status(200).json({ message: 'Notes fetched successfully', notes: notes });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', '); // Collecting validation error messages

            return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};

export const getNoteById: RequestHandler = async (req, res, next) => { // Middleware to handle fetching a note by ID
    try {   
        if (!req.params.id) {
            return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }

        const note = await Note.findById(req.params.id); // Fetching the note by ID

        if (!note) {
            return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }

        res.status(200).json({ message: 'Note fetched successfully', note: note });
    } catch (error: any) {
        if (error.name === 'ValidationError') { 
            const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', '); // Collecting validation error messages

            return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};

export const updateNote: RequestHandler = async (req, res, next) => {
    try {
        if (!req.params.id){
            return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() }, // Updating the note with the new content and setting updatedAt to now
            { new: true, runValidators: true } // Options to return the updated document and run validation
        );

        if (!updateNote) {
            return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }

        res.status(200).json({ message: 'Note updated successfully', note: updatedNote });  
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', '); // Collecting validation error messages

            return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};

export const deleteNote: RequestHandler = async(req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }

        const deletedNote = await Note.findByIdAndDelete(req.params.id); // Deleting the note by ID

        if (!deletedNote) {
            return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }

        res.status(200).json({ message: 'Note deleted successfully', note: deletedNote }); // Responding with a success message and the deleted note
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', '); // Collecting validation error messages

            return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};