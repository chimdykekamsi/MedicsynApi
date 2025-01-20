import jwt from "jsonwebtoken";
import config from "../config";

export function signjwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions
) {
  // Select the appropriate private key
  const key = keyName === "accessTokenPrivateKey"
    ? config.accessTokenPrivateKey
    : config.refreshTokenPrivateKey;

  if (!key) {
    throw new Error(`Missing key: ${keyName}`);
  }

  // Decode the base64-encoded private key
  const signingKey = Buffer.from(key, "base64").toString("ascii");

  return jwt.sign(object, signingKey, options || {});
}

export function verifyjwt<T>(
  token: string,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey"
): T | null {
  // Select the appropriate private key (assuming public key for verification)
  const key = keyName === "accessTokenPrivateKey"
    ? config.accessTokenPrivateKey
    : config.refreshTokenPrivateKey;

  if (!key) {
    throw new Error(`Missing key: ${keyName}`);
  }

  // Decode the base64-encoded key
  const publicKey = Buffer.from(key, "base64").toString("ascii");

  try {
    const decoded = jwt.verify(token, publicKey);
    return decoded as T;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Invalid token");
  }
}
