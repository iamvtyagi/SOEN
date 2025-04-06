import crypto from "crypto";
import "dotenv/config";

// Algorithm to use for encryption
const ALGORITHM = "aes-256-cbc";

/**
 * Encrypts text using AES-256-CBC with a random IV
 * @param {string} text - The text to encrypt
 * @returns {Object} - Object containing the encrypted text and IV
 */
export const encrypt = (text) => {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not defined in environment variables");
  }

  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);

  // Create cipher using the encryption key and IV
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return the encrypted text and IV
  return {
    encryptedText: encrypted,
    iv: iv.toString("hex"),
  };
};

/**
 * Decrypts text that was encrypted with AES-256-CBC
 * @param {string} encryptedText - The encrypted text
 * @param {string} ivHex - The initialization vector in hex format
 * @returns {string} - The decrypted text
 */
export const decrypt = (encryptedText, ivHex) => {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not defined in environment variables");
  }

  // Convert the IV from hex to Buffer
  const iv = Buffer.from(ivHex, "hex");

  // Create decipher using the encryption key and IV
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );

  // Decrypt the text
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
