import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, "Minimum length of username should be 3"]
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email format is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, "Minimum length of password should be 6"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model<IUser>('User', userSchema); // Creating a Mongoose model for the User schema