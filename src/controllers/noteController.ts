import { Note } from '../models/noteModel.js';
import { Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError.js';
import { AuthenticatedRequest } from '../models/authenticatedRequest.js'; // Importing the AuthenticatedRequest interface
import logger from '../logger/logger.js';

export const createNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Middleware to handle note creation
  try {
    if (!req.body) {
      return next(new HttpError('Note content is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const userId = req.user?.id; // Assuming req.user is populated by a previous middleware
    if (!userId) {
      logger.error('User ID is required'); // Log the error if login fails
      return next(new HttpError('User ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const newNote = new Note(req.body);

    newNote.createdAt = new Date(); // Setting the createdAt date to now
    newNote.userId = userId; // Associating the note with the user ID

    const savedNote = await newNote.save(); // Saving the note to the database

    res.status(201).json({ message: 'Note was created successfully', note: savedNote });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', '); // Collecting validation error messages

      return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
    }
    next(error); // Passing the error to the errorHandler middleware
  }
};

export const getNotes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Middleware to handle fetching all notes
  try {
    const userId = req.user?.id; // Assuming req.user is populated by a previous middleware
    if (!userId) {
      return next(new HttpError('User ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const notes = await Note.find({ userId }); // Fetching all notes from the database

    if (!notes) {
      return next(new HttpError('No notes found', 404)); // Using the errorHandler middleware to handle the error
    }

    res.status(200).json({ message: 'Notes fetched successfully', notes: notes });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', '); // Collecting validation error messages

      return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
    }
    next(error); // Passing the error to the errorHandler middleware
  }
};

export const getNoteById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Middleware to handle fetching a note by ID
  try {
    const userId = req.user?.id; // Assuming req.user is populated by a previous middleware
    if (!userId) {
      return next(new HttpError('User ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const noteId = req.params.id; // Extracting the note ID from the request parameters

    if (!noteId) {
      return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const note = await Note.findOne({ _id: noteId, userId }); // Fetching the note by ID

    if (!note) {
      return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
    }

    res.status(200).json({ message: 'Note fetched successfully', note: note });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', '); // Collecting validation error messages

      return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
    }
    next(error); // Passing the error to the errorHandler middleware
  }
};

export const updateNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Assuming req.user is populated by a previous middleware
    if (!userId) {
      return next(new HttpError('User ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const noteId = req.params.id; // Extracting the note ID from the request parameters

    if (!noteId) {
      return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId }, // Finding the note by ID and user ID to ensure the user can only update their own notes
      { ...req.body, updatedAt: new Date() }, // Updating the note with the new content and setting updatedAt to now
      { new: true, runValidators: true } // Options to return the updated document and run validation
    );

    if (!updateNote) {
      return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
    }

    res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', '); // Collecting validation error messages

      return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
    }
    next(error); // Passing the error to the errorHandler middleware
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Assuming req.user is populated by a previous middleware
    if (!userId) {
      return next(new HttpError('User ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const noteId = req.params.id; // Extracting the note ID from the request parameters

    if (!noteId) {
      return next(new HttpError('Note ID is required', 400)); // Using the errorHandler middleware to handle the error
    }

    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId }); // Deleting the note by ID

    if (!deletedNote) {
      return next(new HttpError('Note not found', 404)); // Using the errorHandler middleware to handle the error
    }

    res.status(200).json({ message: 'Note deleted successfully', note: deletedNote }); // Responding with a success message and the deleted note
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', '); // Collecting validation error messages

      return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
    }
    next(error); // Passing the error to the errorHandler middleware
  }
};
