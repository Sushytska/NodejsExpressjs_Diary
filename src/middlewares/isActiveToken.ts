import { Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config.js';
import { RefreshToken } from '../models/refreshTokenModel.js';
import { AuthenticatedRequest } from '../models/authenticatedRequest.js';
import { Types } from 'mongoose';
import logger from '../logger/logger.js';

export const isActiveToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return next(new HttpError('Access token is required', 401)); // If no token is provided, return an error
  }

  if (!refreshToken) {
    return next(new HttpError('Refresh token is required', 401)); // If no refresh token is provided, return an error
  }

  try {
    req.user = jwt.verify(accessToken, config.jwtAccessSecret) as JwtPayload; // Verify the access token and attach the user to the request object
    return next(); // If the access token is valid, proceed to the next middleware
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      try {
        const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as {
          id: string;
          role: string;
        }; // Verify the refresh token
        if (!decoded) {
          return next(new HttpError('Invalid refresh token', 401)); // If the refresh token is invalid, return an error
        }

        const refreshTokenDoc = await RefreshToken.findOne({
          token: refreshToken,
          userId: decoded.id,
        });

        if (!refreshTokenDoc) {
          res.clearCookie('accessToken'); // Clear cookies to log out the user
          res.clearCookie('refreshToken');
          return next(new HttpError('Refresh token not found', 401)); // If the refresh token is not found, return an error
        } else if (refreshTokenDoc.revoked) {
          await RefreshToken.updateMany({ userId: decoded.id }, { revoked: true }); // Revoke all refresh tokens for the user
          // This ensures that if the refresh token is revoked, all associated tokens are also revoked
          // and the user is logged out from all sessions/devices.
          // Second step is to send an email notification to the user for updating their password
          // to prevent unauthorized access.
          // This is a security measure to ensure that if a refresh token is compromised,
          // the user is notified and can take action to secure their account.

          res.clearCookie('accessToken'); // Clear cookies to log out the user
          res.clearCookie('refreshToken');
          logger.error(
            `Refresh token has been revoked: ${refreshTokenDoc._id}, ip address: ${req.ip}`
          ); // Log the revocation of the refresh token
          return next(new HttpError('Invalid token', 401)); // If the refresh token has been revoked, return an error
        } else {
          // If the refresh token is found, revoke it because new tokens will be issued
          refreshTokenDoc.revoked = true;
          refreshTokenDoc.revokedAt = new Date(); // Set the revocation date
          refreshTokenDoc.revocationReason = 'Access token refresh'; // Set the reason for revocation
          await refreshTokenDoc.save();
        }

        const newAccessToken = jwt.sign(
          { id: decoded.id, role: decoded.role },
          config.jwtAccessSecret,
          { expiresIn: config.jwtAccessExpiration } // Generate a new access token
        );

        const newRefreshToken = jwt.sign(
          { id: decoded.id, role: decoded.role },
          config.jwtRefreshSecret,
          { expiresIn: config.jwtRefreshExpiration } // Generate a new refresh token
        );

        res.cookie('accessToken', newAccessToken, {
          // Set the new access token as a cookie
          httpOnly: true,
          secure: config.nodeEnv === 'production',
          maxAge: 15 * 60 * 1000, // Set the cookie to expire in 15 minutes
        });

        res.cookie('refreshToken', newRefreshToken, {
          // Set the new refresh token as a cookie
          httpOnly: true,
          secure: config.nodeEnv === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // Set the cookie to expire in 7 days
        });

        // Save the new refresh token to the database
        const newRefreshTokenDoc = new RefreshToken({
          token: newRefreshToken,
          userId: decoded.id,
          expiresAt: new Date(Date.now() + config.jwtRefreshExpiration * 1000), // Set expiration time
          revoked: false,
          createdAt: new Date(),
        });

        await newRefreshTokenDoc.save(); // Save the new refresh token to the database

        return next(); // If the refresh token is valid, proceed to the next middleware
      } catch (err: any) {
        logger.error(`Refresh token verification failed: ${err.message}`); // Log the error if refresh token verification fails
        return next(new HttpError('Invalid token', 401)); // If the refresh token verification fails, return an error
      }
    }
    logger.error(`Access token verification failed: ${err.message}`); // Log the error if access token verification fails
    return next(new HttpError('Invalid token', 401)); // If the token is invalid, return an error
  }
};
