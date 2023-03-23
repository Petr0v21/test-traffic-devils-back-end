import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export type AdvancedJwtPayload = jwt.JwtPayload & {
  _id: string;
  roles: string[];
};

const auth = async (
  req: TypedRequestBody<{
    user: string | jwt.JwtPayload;
    role: string;
  }>,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-access-token');

  if (!token)
    return res
      .status(403)
      .json({ error: true, message: 'Access Denied: No token provided' });

  try {
    const tokenDetails = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!
    );
    req.body.role = (tokenDetails as AdvancedJwtPayload)?.roles[0];
    req.body.user = tokenDetails;

    next();
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ error: true, message: 'Access Denied: Invalid token' });
  }
};

export default auth;
