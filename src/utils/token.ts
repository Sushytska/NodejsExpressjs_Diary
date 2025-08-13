import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for token generation
import config from '../config/config'; // Importing the configuration

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '900s' });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '7d' });
};