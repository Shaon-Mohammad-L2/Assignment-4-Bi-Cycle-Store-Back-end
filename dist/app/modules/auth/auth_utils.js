"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmailTemplate = exports.generateOTP = exports.verifyToken = exports.createToken = void 0;
exports.hideEmailAfterSentOtp = hideEmailAfterSentOtp;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// jwt token create.
const createToken = (jwtPayload, jwtSecret, expiresIn) => {
    const options = {
        expiresIn: expiresIn,
    };
    return jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, options);
};
exports.createToken = createToken;
// jwt token verify function
const verifyToken = (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (err) {
        throw new AppError_1.default(401, err.message || "Invalid or expired token!");
    }
};
exports.verifyToken = verifyToken;
// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
// create html body for verify otp code.
const generateEmailTemplate = (code) => {
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
exports.generateEmailTemplate = generateEmailTemplate;
function hideEmailAfterSentOtp(email) {
    const [rawLocal, rawDomain] = email.split("@");
    if (!rawDomain) {
        // Edge case if "@" not found
        return email;
    }
    const localPart = rawLocal.trim();
    const firstThree = localPart.slice(0, 3);
    const lastTwo = localPart.slice(-2);
    const hiddenEmail = localPart.length > 5
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
