"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const validateObjectId_1 = require("../middlewares/validateObjectId"); // Middleware to validate ObjectId format
const isActiveToken_1 = require("../middlewares/isActiveToken");
const noteRouter = (0, express_1.Router)();
noteRouter.post('/', isActiveToken_1.isActiveToken, noteController_1.createNote); // Route to create a new note
noteRouter.get('/', noteController_1.getNotes); // Route to fetch all notes
noteRouter.get('/:id', isActiveToken_1.isActiveToken, validateObjectId_1.validateObjectId, noteController_1.getNoteById); // Route to fetch a note by ID
noteRouter.patch('/:id', isActiveToken_1.isActiveToken, validateObjectId_1.validateObjectId, noteController_1.updateNote); // Route to update an existing note
noteRouter.delete('/:id', isActiveToken_1.isActiveToken, validateObjectId_1.validateObjectId, noteController_1.deleteNote); // Route to delete a note by ID
exports.default = noteRouter; // Exporting the note router to be used in the main server file
//# sourceMappingURL=noteRoute.js.map