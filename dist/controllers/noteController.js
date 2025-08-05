"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getNotes = exports.createNote = void 0;
const noteModel_1 = require("../models/noteModel");
const HttpError_1 = require("../utils/HttpError");
const NOTES = [];
const createNote = (req, res, next) => {
    try {
        if (!req.body.note) {
            return next(new HttpError_1.HttpError('Note content is required', 400)); // Using the errorHandler middleware to handle the error
        }
        const newNote = new noteModel_1.Note(Math.random().toString(), req.body.note);
        NOTES.push(newNote);
        res.status(201).json({ message: 'Note was created successfully', note: newNote });
    }
    catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.createNote = createNote;
const getNotes = (req, res, next) => {
    try {
        if (NOTES.length === 0) {
            return next(new HttpError_1.HttpError('No notes found', 404)); // Using the errorHandler middleware to handle the error
        }
        res.status(200).json({ message: 'Notes fetched successfully', notes: NOTES });
    }
    catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.getNotes = getNotes;
const updateNote = (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new HttpError_1.HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }
        const noteId = req.params.id;
        const noteIndex = NOTES.findIndex(note => note.id === noteId);
        if (noteIndex === -1) {
            return next(new HttpError_1.HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }
        const existingNote = NOTES[noteIndex];
        const updatedNote = {
            ...existingNote, // Keeping the existing note properties
            ...req.body.note // Updating the content with the new note content from the request body
        };
        NOTES[noteIndex] = updatedNote; // Updating the note in the array
        res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    }
    catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.updateNote = updateNote;
const deleteNote = (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new HttpError_1.HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }
        const noteId = req.params.id;
        const noteIndex = NOTES.findIndex(note => note.id === noteId);
        if (noteIndex === -1) {
            return next(new HttpError_1.HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }
        NOTES.splice(noteIndex, 1); // Removing the note from the array
        res.status(200).json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.deleteNote = deleteNote;
