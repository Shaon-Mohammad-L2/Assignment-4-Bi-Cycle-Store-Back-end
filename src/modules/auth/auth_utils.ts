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

// create html body for verify otp code.
export const generateEmailTemplate = (code: string): string => {
  return `
 <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
  <div style="text-align: center; padding: 20px;">
    <h1 style="text-align: center; padding: 20px;">Bi Cycle Store</h1>
  </div>
  <h2 style="text-align: center;">Your Verification Code!</h2>
  <p style="text-align: center;">
    This code is valid for the next 10 minutes.
  </p>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: #f4f4f4;
      padding: 10px;
      border-radius: 5px;
      width: fit-content;
      margin: 20px auto 5px auto;
      letter-spacing: 20px;
    "
  >
    <strong style="font-size: 34px; color: #333;">${code}</strong>
  </div>

 <div>
 </div>
</div>


  `;
};

export function hideEmailAfterSentOtp(email: string): string {
  const [rawLocal, rawDomain] = email.split("@");
  if (!rawDomain) {
    // Edge case if "@" not found
    return email;
  }

  const localPart = rawLocal.trim();

  const firstThree = localPart.slice(0, 3);

  const lastTwo = localPart.slice(-2);

  const hiddenEmail =
    localPart.length > 5
      ? `${firstThree}*****${lastTwo}`
      : localPart.replace(/.(?=.)/g, "**");

  const lastDotIndex = rawDomain.lastIndexOf(".");
  if (lastDotIndex <= 0) {
    return `${hiddenEmail}@****`;
  }

  const domainName = rawDomain.slice(0, lastDotIndex);
  const domainTld = rawDomain.slice(lastDotIndex);

  const hiddenDomain = `****${domainTld}`;

  return `${hiddenEmail}@${hiddenDomain}`;
}
