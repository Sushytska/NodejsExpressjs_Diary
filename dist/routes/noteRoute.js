"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const noteRouter = (0, express_1.Router)();
noteRouter.post('/', noteController_1.createNote); // Route to create a new note
noteRouter.get('/', noteController_1.getNotes); // Route to fetch all notes
noteRouter.patch('/:id', noteController_1.updateNote); // Route to update an existing note
noteRouter.delete('/:id', noteController_1.deleteNote); // Route to delete a note by ID
exports.default = noteRouter; // Exporting the note router to be used in the main server file
