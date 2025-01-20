import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "CONNECTION_STRING",
  "ACCESSTOKEN",
  "REFRESHTOKEN",
  "PORT",
  "APP_URL",
  "MAIL_HOST",
  "MAIL_PORT",
  "MAIL_USER",
  "MAIL_PASS",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export default {
  CONNECTION_STRING: process.env.CONNECTION_STRING!,
  accessTokenPrivateKey: process.env.ACCESSTOKEN!,
  refreshTokenPrivateKey: process.env.REFRESHTOKEN!,
  PORT: process.env.PORT!,
  APP_URL: process.env.APP_URL!,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: Number(process.env.MAIL_PORT),
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  CLIENT_URL: process.env.CLIENT_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};
