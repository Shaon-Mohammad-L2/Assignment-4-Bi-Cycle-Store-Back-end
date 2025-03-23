import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { TJwtPayload } from "./auth_interface";

// jwt token create.
export const createToken = (
  jwtPayload: TJwtPayload,
  jwtSecret: Secret,
  expiresIn: string
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(jwtPayload, jwtSecret, options);
};

// jwt token verify function
export const verifyToken = (token: string, secret: Secret) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (err: any) {
    throw new AppError(401, err.message || "Invalid or expired token!");
  }
};

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
