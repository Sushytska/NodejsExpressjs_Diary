import mongoose, { Schema } from 'mongoose';
const noteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Minimum length of character should be 2'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [4, 'Minimum length of character should be 4'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
export const Note = mongoose.model('Note', noteSchema); // Creating a Mongoose model for the Note schema
//# sourceMappingURL=noteModel.js.map