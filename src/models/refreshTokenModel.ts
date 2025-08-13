import mongoose, { Document, Schema } from "mongoose";    

export interface IRefreshToken extends Document {
    token: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

