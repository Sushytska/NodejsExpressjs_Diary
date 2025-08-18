import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema: Schema = new Schema({
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

export const Note = mongoose.model<INote>('Note', noteSchema); // Creating a Mongoose model for the Note schema
