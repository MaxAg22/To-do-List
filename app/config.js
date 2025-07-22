import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;

export const DB_HOST = process.env.DB_HOST || process.env.MY_HOST;
export const DB_USER = process.env.DB_USER || process.env.MY_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD || process.env.MY_PASSWORD;
export const DB_NAME = process.env.DB_NAME || process.env.MY_NAME;
export const DB_PORT = process.env.DB_PORT || process.env.MY_PORT;

export const JWT_SECRET = process.env.JWT_SECRET || process.env.MY_JWT_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || process.env.MY_JWT_EXPIRATION;
export const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES || process.env.MY_JWT_COOKIE_EXPIRES;

console.log("Config DB_HOST:", process.env.DB_HOST);
