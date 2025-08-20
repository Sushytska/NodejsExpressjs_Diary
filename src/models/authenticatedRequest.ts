import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
// This interface extends the Express Request object to include a user property
// that contains the JWT payload. The user property is optional and can include id of type mongoose.Types.ObjectId.
// This allows us to access the authenticated user's information in our request handlers.
