import { RefreshToken } from "../models/refreshTokenModel";

export const cleanUpTokenDB = async () => {
    // Delete revoked tokens older than 30 days
    await RefreshToken.deleteMany({
        revoked: true,
        revokedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
};