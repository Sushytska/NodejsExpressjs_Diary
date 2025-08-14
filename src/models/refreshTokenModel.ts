import mongoose, { Document, Schema } from "mongoose";    

export interface IRefreshToken extends Document {
    token: string;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date; 
    revoked: boolean;
    revokedAt?: Date; // Optional field to store when the token was revoked
    revocationReason?: string; // Optional field to store the reason for revocation
    createdAt: Date;
};

const refreshTokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true // Ensuring the token is unique
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User' // Reference to the User model
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiration date is required']
    },
    revoked: {
        type: Boolean,
        default: false // Default to false, indicating the token is active
    },
    revokedAt: {
        type: Date,
        default: null // Default to null, indicating the token is not revoked
    },  
    revocationReason: {
        type: String,
        default: null // Default to null, indicating no reason for revocation
    },  
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema); // Creating a Mongoose model for the RefreshToken schema



