import { Router } from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/noteController';
import { validateObjectId } from '../middlewares/validateObjectId'; // Middleware to validate ObjectId format
import { isActiveToken } from '../middlewares/isActiveToken';

const noteRouter = Router();

noteRouter.post('/',isActiveToken, createNote); // Route to create a new note
noteRouter.get('/', isActiveToken, getNotes); // Route to fetch all notes
noteRouter.get('/:id', isActiveToken, validateObjectId, getNoteById); // Route to fetch a note by ID
noteRouter.patch('/:id', isActiveToken, validateObjectId, updateNote); // Route to update an existing note
noteRouter.delete('/:id', isActiveToken, validateObjectId, deleteNote); // Route to delete a note by ID

export default noteRouter; // Exporting the note router to be used in the main server file