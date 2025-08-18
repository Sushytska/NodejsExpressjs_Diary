import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { validateObjectId } from '../middlewares/validateObjectId.js'; // Middleware to validate ObjectId format
import { isActiveToken } from '../middlewares/isActiveToken.js';

const noteRouter = Router();

noteRouter.post('/', isActiveToken, createNote); // Route to create a new note
noteRouter.get('/', getNotes); // Route to fetch all notes
noteRouter.get('/:id', isActiveToken, validateObjectId, getNoteById); // Route to fetch a note by ID
noteRouter.patch('/:id', isActiveToken, validateObjectId, updateNote); // Route to update an existing note
noteRouter.delete('/:id', isActiveToken, validateObjectId, deleteNote); // Route to delete a note by ID

export default noteRouter; // Exporting the note router to be used in the main server file
