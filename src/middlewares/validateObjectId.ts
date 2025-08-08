import { Request, Response, NextFunction } from "express";  
import mongoose from "mongoose";
import { HttpError } from "../utils/HttpError";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id || req.body.id; // Get the ID from the request parameters or body

    if (!id) {
        return next(new HttpError('ID is required', 400)); // If no ID is provided, return an error
    }

    if (!mongoose.Types.ObjectId.isValid(id)) { // it should be 24-character hex
        return next(new HttpError('Invalid ID format', 400)); 
    }

    next(); // If the ID is valid, proceed to the next middleware
};