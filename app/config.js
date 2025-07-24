import dotenv from "dotenv";
dotenv.config();

export const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://to-do-list-production-13e5.up.railway.app"
  : process.env.DEV_BASE_URL;

export const PORT = process.env.PORT;

export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
export const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES;

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;