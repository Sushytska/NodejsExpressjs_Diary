import bcrypt from 'bcrypt'; // Importing bcrypt for password hashing
import { User } from '../models/userModel.js';
import { HttpError } from '../utils/HttpError.js'; // Importing a custom error handler
import { RequestHandler } from 'express'; // Importing RequestHandler type from express for type safety
import config from '../config/config.js'; // Importing the configuration
import { generateTokens } from '../utils/generateTokens.js'; // Importing token generation functions
import { RefreshToken } from '../models/refreshTokenModel.js';

export const registerUser: RequestHandler = async (req, res, next) => {
  // Middleware to handle user registration
  try {
    const { username, email, password } = req.body; // Extracting username and password from the request body

    if (!username || !email || !password) {
      return next(new HttpError('Username, email and password are required', 400)); // Using the errorHandler middleware to handle the error
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password with a salt rounds of 10

    const newUser = new User({ username, email, password: hashedPassword }); // Creating a new user instance

    await newUser.save(); // Saving the user to the database

    res.status(201).json({ message: 'User registered successfully' }); // Responding with a success message
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', '); // Collecting validation error messages

      return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
    }
    next(error); // Passing the error to the errorHandler middleware
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  // Middleware to handle user login
  try {
    const { email, password } = req.body; // Extracting username and password from the request body

    if (!email || !password) {
      return next(new HttpError('Email and password are required', 400)); // Using the errorHandler middleware to handle the error
    }

    const user = (await User.findOne({ email })) as { _id: any; password: string }; // Finding the user by username

    if (!user) {
      return next(new HttpError('Invalid email', 401)); // Using the errorHandler middleware to handle the error
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Comparing the provided password with the hashed password

    if (!isPasswordValid) {
      return next(new HttpError('Invalid password', 401)); // Using the errorHandler middleware to handle the error
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      role: 'user',
    }); // Generating access and refresh tokens

    res.cookie('accessToken', accessToken, {
      // Setting the access token as a cookie
      httpOnly: true, // Secure: true, // Ensuring the cookie is only sent over HTTPS
      secure: config.nodeEnv === 'production', // Setting secure flag based on the environment
      maxAge: 15 * 60 * 1000, // Setting the cookie to expire in 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      // Setting the refresh token as a cookie
      httpOnly: true, // Secure: true, // Ensuring the cookie is only sent over HTTPS
      secure: config.nodeEnv === 'production', // Setting secure flag based on the environment
      maxAge: 7 * 24 * 60 * 60 * 1000, // Setting the cookie to expire in 7 days
    });

    // Save the refresh token to the database
    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id.toString(),
      revoked: false, // Initially, the token is not revoked
      expiresAt: new Date(Date.now() + config.jwtRefreshExpiration * 1000), // Set expiration time
      createdAt: new Date(),
    });
    await refreshTokenDoc.save(); // Saving the refresh token to the database
    // Responding with the access token and refresh token
    // Note: In a real application, you might want to return the tokens in the response
    // instead of setting them as cookies, depending on your authentication strategy.
    // However, for this example, we are setting them as cookies for simplicity.
    // This allows the client to automatically send the tokens with subsequent requests.
    // This is useful for maintaining the user's session without requiring them to log in again.
    // The access token is used to authenticate the user for protected routes,
    // while the refresh token is used to obtain a new access token when the current one expires

    res.status(200).json({ message: 'Login successful' }); // Responding with a success message and the token
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', '); // Collecting validation error messages

      return next(new HttpError(errorMessage, 400)); // Using the errorHandler middleware to handle validation errors
    }
    next(error); // Passing the error to the errorHandler middleware
  }
};
