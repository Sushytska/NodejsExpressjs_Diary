"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getNoteById = exports.getNotes = exports.createNote = void 0;
const noteModel_1 = require("../models/noteModel");
const HttpError_1 = require("../utils/HttpError");
const createNote = async (req, res, next) => {
    try {
        if (!req.body) {
            return next(new HttpError_1.HttpError('Note content is required', 400)); // Using the errorHandler middleware to handle the error
        }
        const newNote = new noteModel_1.Note(req.body);
        newNote.createdAt = new Date(); // Setting the createdAt date to now
        const savedNote = await newNote.save(); // Saving the note to the database
        res.status(201).json({ message: 'Note was created successfully', note: savedNote });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', '); // Collecting validation error messages
            return next(new HttpError_1.HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.createNote = createNote;
const getNotes = async (req, res, next) => {
    try {
        const notes = await noteModel_1.Note.find(); // Fetching all notes from the database
        if (!notes) {
            return next(new HttpError_1.HttpError('No notes found', 404)); // Using the errorHandler middleware to handle the error
        }
        res.status(200).json({ message: 'Notes fetched successfully', notes: notes });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', '); // Collecting validation error messages
            return next(new HttpError_1.HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.getNotes = getNotes;
const getNoteById = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new HttpError_1.HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }
        const note = await noteModel_1.Note.findById(req.params.id); // Fetching the note by ID
        if (!note) {
            return next(new HttpError_1.HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }
        res.status(200).json({ message: 'Note fetched successfully', note: note });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', '); // Collecting validation error messages
            return next(new HttpError_1.HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.getNoteById = getNoteById;
const updateNote = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new HttpError_1.HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }
        const updatedNote = await noteModel_1.Note.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, // Updating the note with the new content and setting updatedAt to now
        { new: true, runValidators: true } // Options to return the updated document and run validation
        );
        if (!exports.updateNote) {
            return next(new HttpError_1.HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }
        res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', '); // Collecting validation error messages
            return next(new HttpError_1.HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new HttpError_1.HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
        }
        const deletedNote = await noteModel_1.Note.findByIdAndDelete(req.params.id); // Deleting the note by ID
        if (!deletedNote) {
            return next(new HttpError_1.HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
        }
        res.status(200).json({ message: 'Note deleted successfully', note: deletedNote }); // Responding with a success message and the deleted note
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', '); // Collecting validation error messages
            return next(new HttpError_1.HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};
exports.deleteNote = deleteNote;
//# sourceMappingURL=noteController.js.map