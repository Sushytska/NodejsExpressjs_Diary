import { Router } from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/noteController';

const noteRouter = Router();

noteRouter.post('/', createNote); // Route to create a new note
noteRouter.get('/', getNotes); // Route to fetch all notes
noteRouter.patch('/:id', updateNote); // Route to update an existing note
noteRouter.delete('/:id', deleteNote); // Route to delete a note by ID

export default noteRouter; // Exporting the note router to be used in the main server file