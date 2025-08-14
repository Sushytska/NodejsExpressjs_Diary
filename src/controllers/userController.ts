import jwt from 'jsonwebtoken'; // Importing the jsonwebtoken library for token generation
import bcrypt from 'bcrypt'; // Importing bcrypt for password hashing
import { User } from '../models/userModel';
import { HttpError } from '../utils/HttpError'; // Importing a custom error handler
import { RequestHandler } from 'express'; // Importing RequestHandler type from express for type safety
import config from '../config/config'; // Importing the configuration
import { generateTokens } from '../utils/generateTokens'; // Importing token generation functions

export const registerUser: RequestHandler = async (req, res, next) => { // Middleware to handle user registration
    try {   
        const { username, password } = req.body; // Extracting username and password from the request body

        if (!username || !password) {
            return next(new HttpError('Username and password are required', 400)); // Using the errorHandler middleware to handle the error
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password with a salt rounds of 10

        const newUser = new User({ username, password: hashedPassword }); // Creating a new user instance

        await newUser.save(); // Saving the user to the database

        res.status(201).json({ message: 'User registered successfully' }); // Responding with a success message
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', '); // Collecting validation error messages

            return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }   
};

export const loginUser: RequestHandler = async (req, res, next) => { // Middleware to handle user login
    try {
        const { username, password } = req.body; // Extracting username and password from the request body

        if (!username || !password) {
            return next(new HttpError('Username and password are required', 400)); // Using the errorHandler middleware to handle the error
        }

        const user = await User.findOne({ username }) as { _id: any, password: string }; // Finding the user by username

        if (!user) {
            return next(new HttpError('Invalid username or password', 401)); // Using the errorHandler middleware to handle the error
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Comparing the provided password with the hashed password

        if (!isPasswordValid) {
            return next(new HttpError('Invalid username or password', 401)); // Using the errorHandler middleware to handle the error
        }

        const { accessToken, refreshToken } = generateTokens({ userId: user._id.toString(), role: 'user' }); // Generating access and refresh tokens

        res.cookie("accessToken", accessToken, { // Setting the access token as a cookie
            httpOnly: true, // Secure: true, // Ensuring the cookie is only sent over HTTPS
            secure: config.nodeEnv === 'production', // Setting secure flag based on the environment
            maxAge: 15 * 60 * 1000 // Setting the cookie to expire in 15 minutes
        });

        res.cookie("refreshToken", refreshToken, { // Setting the refresh token as a cookie
            httpOnly: true, // Secure: true, // Ensuring the cookie is only sent over HTTPS
            secure: config.nodeEnv === 'production', // Setting secure flag based on the environment
            maxAge: 7 * 24 * 60 * 60 * 1000 // Setting the cookie to expire in 7 days
        });

        res.status(200).json({ message: 'Login successful' }); // Responding with a success message and the token
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', '); // Collecting validation error messages

            return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
        }
        next(error); // Passing the error to the errorHandler middleware
    }
};