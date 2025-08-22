import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/register', registerUser); // Route to register a new user
authRouter.post('/login', loginUser); // Route to log in an existing user
authRouter.post('/logout', logoutUser); // Route to log out the user

export default authRouter; // Exporting the auth router to be used in the main server file
