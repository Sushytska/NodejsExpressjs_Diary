import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for token generation
import config from '../config/config'; // Importing the configuration

export const generateTokens = (payload: { userId: string, role: string }) => {
    const accessToken = jwt.sign(
        { id: payload.userId, role: payload.role },
        config.jwtAccessSecret,
        { expiresIn: config.jwtAccessExpiration } // Access token expires in 15 minutes 
    );

    const refreshToken = jwt.sign(
        { id: payload.userId, role: payload.role },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiration } // Refresh token expires in 7 days
    );

    return { accessToken, refreshToken }; // Returning both tokens
};